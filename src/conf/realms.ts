import './realms.css';

export const CONF = {
    theme: "realms",
    useLanding: false,
    briqMaterials: ["0x2"],
    defaultMaterial: "0x2",
    builderSettings: {
        darkMode: {
            planeColor: "#161619",
            gridColor: "#8d795b",
            backgroundColor: "#929090",
        },
        lightMode: {
            planeColor: "#161619",
            gridColor: "#8d795b",
            backgroundColor: "#929090",    
        },
        canvasSize: 20,
        maxCanvasSize: 150,
    },
    defaultPalette: {
        '#ffffff': 'True Ice',
        '#eeeeee': 'Silver',
        '#cdcdcd': 'Silver A',
        '#b5b0b0': 'Silver B',
        '#999999': 'Stone',
        '#878787': 'Stone A',
        '#646464': 'Stone B',
        '#444444': 'Coal',
        '#313131': 'Coal A',
        '#171717': 'Coal B',
        '#000000': 'Obsidian',
        '#794200': 'Wood',
        '#78350f': 'Wood A',
        '#623500': 'Wood B',
        '#fcd34d': 'Gold',
        '#f0af19': 'Gold A',
        '#e59e1a': 'Gold B',
        '#f59e0b': 'Copper',
        '#d44c28': 'Copper A',
        '#e86034': 'Copper B',
        '#ef4444': 'Ignium',
        '#b91c1c': 'Ironwood',
        '#dc2626': 'Ruby',
        '#ec4899': 'Dragonhide',
        '#fca5a5': 'Cold Iron',
        '#ccbcfb': 'Diamonds',
        '#93c5fd': 'Deep Crystal',
        '#60a5fa': 'Mithral',
        '#3b82f6': 'Sapphire',
        '#1e3a8a': 'Adamantine',
        '#6d28d9': 'Twilight Quartz',
        '#10b981': 'Ethereal Silica',
    }
}

export const defaultModel: { "pos": [number, number, number], "color": string }[] = [
    {"pos":[-6,0,0], "color":"#ffffff"},
    {"pos":[-7,1,0], "color":"#ffffff"},
    {"pos":[-7,2,0], "color":"#ffffff"},
    {"pos":[-5,0,0], "color":"#ffffff"},
    {"pos":[-5,6,0], "color":"#ffffff"},
    {"pos":[-5,7,0], "color":"#ffffff"},
    {"pos":[-4,0,0], "color":"#ffffff"},
    {"pos":[-4,5,0], "color":"#ffffff"},
    {"pos":[-4,8,0], "color":"#ffffff"},
    {"pos":[-3,0,0], "color":"#ffffff"},
    {"pos":[-3,4,0], "color":"#ffffff"},
    {"pos":[-3,9,0], "color":"#ffffff"},
    {"pos":[-2,9,0], "color":"#ffffff"},
    {"pos":[-2,8,0], "color":"#ffffff"},
    {"pos":[-2,7,0], "color":"#ffffff"},
    {"pos":[-2,6,0], "color":"#ffffff"},
    {"pos":[-2,5,0], "color":"#ffffff"},
    {"pos":[-2,4,0], "color":"#ffffff"},
    {"pos":[-2,3,0], "color":"#ffffff"},
    {"pos":[-2,2,0], "color":"#ffffff"},
    {"pos":[-2,1,0], "color":"#ffffff"},
    {"pos":[-2,0,0], "color":"#ffffff"},
    {"pos":[4,0,0],"color":"#ffffff"},
    {"pos":[3,0,0],"color":"#ffffff"},
    {"pos":[2,0,0],"color":"#ffffff"},
    {"pos":[1,0,0],"color":"#ffffff"},
    {"pos":[1,1,0],"color":"#ffffff"},
    {"pos":[1,2,0],"color":"#ffffff"},
    {"pos":[1,3,0],"color":"#ffffff"},
    {"pos":[1,4,0],"color":"#ffffff"},
    {"pos":[1,5,0],"color":"#ffffff"},
    {"pos":[1,6,0],"color":"#ffffff"},
    {"pos":[1,7,0],"color":"#ffffff"},
    {"pos":[1,8,0],"color":"#ffffff"},
    {"pos":[2,4,0],"color":"#ffffff"},
    {"pos":[3,5,0],"color":"#ffffff"},
    {"pos":[4,6,0],"color":"#ffffff"},
    {"pos":[4,7,0],"color":"#ffffff"},
    {"pos":[3,8,0],"color":"#ffffff"},
    {"pos":[2,9,0],"color":"#ffffff"},
    {"pos":[1,9,0],"color":"#ffffff"},
    {"pos":[5,0,0],"color":"#ffffff"},
    {"pos":[6,1,0],"color":"#ffffff"},
    {"pos":[6,2,0],"color":"#ffffff"},
    {"pos":[1,10,0],"color":"#ffffff"},
    {"pos":[0,10,0],"color":"#ffffff"},
    {"pos":[2,11,0],"color":"#ffffff"},
    {"pos":[0,11,0],"color":"#ffffff"},
    {"pos":[-1,10,0],"color":"#ffffff"},
    {"pos":[-1,11,0],"color":"#ffffff"},
    {"pos":[-2,10,0],"color":"#ffffff"},
    {"pos":[-3,11,0],"color":"#ffffff"}
];

export * as RealmsLogo from '@/assets/Realms.svg';
