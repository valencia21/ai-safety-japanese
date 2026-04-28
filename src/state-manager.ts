import { atom } from 'jotai';
import { currentProject } from '~/config/project';

export const activeTabAtom = atom(currentProject.tabs[0].id);
