// Copies the visible workflow template when Finder/web uploads missed the .github folder.
import {mkdir,copyFile} from 'node:fs/promises';
await mkdir(new URL('../.github/workflows/',import.meta.url),{recursive:true});await copyFile(new URL('../ops/update-data.workflow.yml',import.meta.url),new URL('../.github/workflows/update-data.yml',import.meta.url));console.log('Workflow installed. Commit and push .github/workflows/update-data.yml with the other project files.');
