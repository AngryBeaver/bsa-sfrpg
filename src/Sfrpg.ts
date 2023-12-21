import {CUSTOM_SKILLS, NAMESPACE} from "./SfrpgSettings.js";

export class Sfrpg implements SystemApi {

    get version() {
        return 2;
    }

    get id() {
        return "sfrpg";
    }
    async actorRollSkill(actor, skillId){
        let skill = actor.system.skills.skillId;
        if(!skill){
            Object.entries(actor.system.skills).forEach(([id,s])=> {
                // @ts-ignore
                if(s.subname && "pro"+s.subname.toLowerCase().trim() === skillId) {
                    skillId = id;
                    skill = s;
                }
            });
        }
        if(!skill){
            ui.notifications?.error("skill not found on actor");
        }
        const message = await actor.rollSkillCheck(skillId,skill);
        if(!message){
            return null
        }
        return message.callbackResult;
    }

    async actorRollAbility(actor, abilityId){
        const message =  await actor.rollAbility(abilityId);
        if(!message){
            return null
        }
        return message.callbackResult;
    }

    actorCurrenciesGet(actor):Currencies {
        return {"credit":actor["system"].currency.credit};
    }

    async actorCurrenciesStore(actor, currencies: Currencies): Promise<void> {
        await actor.update({system: {currency: currencies}});
    }

    actorSheetAddTab(sheet, html, actor, tabData:{ id: string, label: string, html: string }, tabBody:string):void {
        const tabs = $(html).find('nav[data-group="primary"]');
        const tabItem = $('<a class="item" data-tab="' + tabData.id + '" title="' + tabData.label + '">'+tabData.label+'</a>');
        tabs.append(tabItem);
        const body = $(html).find(".sheet-body");
        const tabContent = $('<div class="tab flexcol" data-group="primary" data-tab="' + tabData.id + '"></div>');
        body.append(tabContent);
        tabContent.append(tabBody);
    }

    itemSheetReplaceContent(app, html, element):void {
        html.find('.sheet-navigation').remove();
        var properties = html.find('.item-properties').clone();
        const sheetBody = html.find('.sheet-body');
        sheetBody.addClass("flexrow");
        sheetBody.empty();
        sheetBody.append(properties);
        sheetBody.append(element);
    }

    get configSkills():SkillConfig[] {
        const customSkillString:String = game[NAMESPACE].Settings.get(CUSTOM_SKILLS) || "";
        const skills = Object.entries(CONFIG["SFRPG"].skills).map(skills => {
            return {
                id: skills[0],
                label: skills[1] as string
            };
        })
        customSkillString.split(",").forEach(skill=>{
            skills.push({id:"pro"+skill.trim().toLowerCase(), label:skill.trim()})
        });
        return skills;
    }

    get configAbilities():AbilityConfig[] {
        return Object.entries(CONFIG["SFRPG"].abilities).map(ab => {
            return {
                id: ab[0],
                label:ab[1] as string
            };
        });
    }

    get configCurrencies():CurrencyConfig[] {
        return [
            {
                id: "credit",
                factor: 1,
                label: game["i18n"].localize("SFRPG.Currencies.Credits"),
            }
        ]
    }

    get configCanRollAbility():boolean {
        return true;
    }
    get configLootItemType(): string {
        return "goods";
    }

    get itemPriceAttribute(): string {
        return "system.price";
    }

    get itemQuantityAttribute(): string {
        return "system.quantity";
    }

}