import {generateClient} from "aws-amplify/api";
import type {Schema} from "../../amplify/data/resource.ts";
import {GlobalSettings} from "./DefaultSettings.ts";

const client = generateClient<Schema>();

export const InitSettings = async () => {
    try {
        const {data, errors} = await client.models.Settings.list();
        if (errors) {
            console.error(errors);
            return;
        }
        for (const setting of data) {
            if (GlobalSettings[setting.name]) {
                GlobalSettings[setting.name].value = setting.value;
            } else {
                const {errors} = await client.models.Settings.delete({
                    id: setting.id
                });
                if (errors) {
                    console.error(`Error deleting setting with id ${setting.id}:`, errors);
                }
            }
        }
        for (const key in GlobalSettings) {
            if (!data.find(setting => setting.name === key)) {
                const {errors} = await client.models.Settings.create({
                    name: key,
                    value: GlobalSettings[key].value,
                    description: null,
                    type: GlobalSettings[key].type,
                });
                if (errors) {
                    console.error(`Error create setting with key ${key}:`, errors);
                    return;
                }
            }
        }
    } catch (error) {
        console.error(`Error loading settings: ${(error as Error).message}`);
    }
}