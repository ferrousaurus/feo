import z from "zod";

const feoArrayObjectValidator = z
  .object({
    $feo: z.object({
      action: z.enum(["add", "remove"]).default("add"),
      content: z.json().optional(),
      id: z.string().optional(),
    }),
  })
  .catchall(z.json())
  .catch((ctx) => ({
    $feo: {
      action: "add",
      content: z.json().parse(ctx.value),
    },
  }));

export default feoArrayObjectValidator;
