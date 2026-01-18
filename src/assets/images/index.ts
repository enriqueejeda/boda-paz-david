// Importa las imágenes como URLs (lazy loading)
const David_Paz_hero = new URL('./David_Paz_hero.webp', import.meta.url).href;
const David_Paz_3 = new URL('./David_Paz_3.webp', import.meta.url).href;
const David_Paz_4 = new URL('./David_Paz_4.webp', import.meta.url).href;
const David_Paz_5 = new URL('./David_Paz_5.webp', import.meta.url).href;
const David_Paz_6 = new URL('./David_Paz_6.webp', import.meta.url).href;
const Logo_Boda = new URL('./logo-boda.png', import.meta.url).href;

export const IMAGES = {
    hero: David_Paz_hero,
    image1: David_Paz_3,
    image2: David_Paz_4,
    image3: David_Paz_5,
    image4: David_Paz_6,
    logo: Logo_Boda
};

export default IMAGES;