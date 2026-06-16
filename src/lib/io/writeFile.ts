import fs from "node:fs/promises";

const writeFile = async (file: string | URL, data: string) => await fs.writeFile(file, data);

export default writeFile;
