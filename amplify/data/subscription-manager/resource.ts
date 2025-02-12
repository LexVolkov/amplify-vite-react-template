import { defineFunction } from "@aws-amplify/backend";

export const subscriptionManager = defineFunction({
    name: "subscription-manager",
    entry: './handler.ts',
});