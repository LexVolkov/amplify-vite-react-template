import {generateClient} from "aws-amplify/api";
import type {Schema} from "../../amplify/data/resource.ts";
import {GlobalSettings} from "./DefaultSettings.ts";
import {accessLevel} from "./AccessLevel.tsx";

const client = generateClient<Schema>();

export const InitSettings = async (authMode: 'identityPool' | 'userPool', groups: string | string[]) => {

    try {
        const {data, errors} = await client.models.Settings.list({
            authMode: authMode
        });
        if (errors) {
            console.log(errors)
            return errors[0].message;
        }
        for (const setting of data) {
            if (GlobalSettings[setting.name]) {
                GlobalSettings[setting.name].value = setting.value;
            } else {
                if (groups.includes(accessLevel.admin)) {
                    const {errors} = await client.models.Settings.delete({
                        id: setting.id
                    });
                    if (errors) {
                        console.log(errors)
                        return errors[0].message;
                    }
                }
            }
        }
        if (groups.includes(accessLevel.admin)) {
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
                        return errors[0].message;
                    }
                }
            }
        }
    } catch (error) {
        console.error(`Error loading settings: ${(error as Error).message}`);
        return (error as Error).message;
    }
}