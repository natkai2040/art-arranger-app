import {writable} from  'svelte/store'; 

export const CurrentWallStore = writable({}); // Stores the Current Wall, And Updates Whenever Save 
export const ModeStore = writable("view"); 