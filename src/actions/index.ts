import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import "~/features/persistence/persistence";
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
    },
  }),
};
