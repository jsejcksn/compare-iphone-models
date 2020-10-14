// deno run --allow-net --allow-read=. --allow-write=. save-data.ts
import * as path from 'https://deno.land/std@0.74.0/path/mod.ts';
import {ensureDir} from 'https://deno.land/std@0.74.0/fs/ensure_dir.ts';

const getTimestamp = (date: Date): string => {
  const fractionalSecondsIndex = 19;
  return `${date.toISOString().slice(0, fractionalSecondsIndex).replaceAll(/-|:/gu, '')}Z`;
};

const main = async () => {
  const dataDir = path.resolve('data');
  await ensureDir(dataDir);

  const validArgs = {
    download: 'download',
    stdin: 'stdin',
  } as const;
  
  const [argument] = Deno.args;
  
  switch (argument) {
    case validArgs.download: {
      const url = 'https://www.apple.com/iphone/compare/';
      const response = await fetch(url);
      if (!response.ok) throw new Error('Response not OK');
      const html = await response.text();
      const htmlPath = path.join(dataDir, `apple-iphone-compare-cached_${getTimestamp(new Date())}.html`);
      await Deno.writeTextFile(htmlPath, html);
      console.log(`HTML saved to ${htmlPath}`);
      break;
    }
    case validArgs.stdin: {
      const data = new TextDecoder().decode(await Deno.readAll(Deno.stdin));
      const jsonPath = path.join(dataDir, `compare.json`);
      await Deno.writeTextFile(jsonPath, data);
      console.log(`stdin saved to ${jsonPath}`);
      break;
    }
    default: {
      const error = new SyntaxError(`Must provide one of the following arguments: ${Object.values(validArgs).map(arg => `"${arg}"`).join(', ')}`);
      console.error(error.toString());
      Deno.exit(1);
    }
  }
};

if (import.meta.main) main();
