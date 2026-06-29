import { Liquid } from "liquidjs";

const engine = new Liquid();

export default async function liquid(template: string, vars: Record<string, unknown>) {
  return await engine.parseAndRender(template, vars);
}
