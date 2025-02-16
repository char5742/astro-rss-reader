import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { updateSettings } from "~/store/settings";
import { UserSettingsSchema } from "~/types/user";

export const server = {
  updateSettings: defineAction({
    accept: "form",
    input: z.object({
      theme: UserSettingsSchema.shape.appearance.shape.theme,
      fontSize: UserSettingsSchema.shape.appearance.shape.fontSize,
    }),
    handler: async (input) => {
      updateSettings({
        appearance: {
          theme: input.theme,
          fontSize: input.fontSize,
        },
      });
      return {
        status: 200,
        message: "Settings updated successfully",
      };
    },
  }),
};
