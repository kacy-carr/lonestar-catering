import { useState, useEffect } from "react";

// ── MOCK DATA ─────────────────────────────────────────────────────────────────
const MOCK_USERS = {
  "jane@example.com": { password:"lonestar1", name:"Jane Smith", phone:"(432) 555-0101", points:340, orders:[
    { id:"LS-1021", date:"2025-03-14", service:"Buffet · BBQ", guests:45, total:1575, pts:1575, status:"Completed" },
    { id:"LS-0987", date:"2025-01-22", service:"Coffee Break", guests:20, total:440,  pts:440,  status:"Completed" },
  ]},
  "demo@cantinita.com": { password:"demo", name:"Demo User", phone:"(432) 555-0000", points:820, orders:[
    { id:"LS-1044", date:"2025-04-10", service:"Banquet", guests:80, total:4960, pts:4960, status:"Completed" },
    { id:"LS-1055", date:"2025-05-01", service:"Box Lunch", guests:12, total:240, pts:240, status:"Upcoming" },
  ]},
};

const TESTIMONIALS = [
  { name:"Maria G.", event:"Wedding · 350 guests", text:"The brisket was unreal. Our guests are still talking about it. Lonestar made our reception feel like the best cookout of our lives." },
  { name:"Travis W.", event:"Oilfield Crew · 200 workers", text:"Hot, hearty, real Texas food out in the field. These guys showed up on time and knocked it out of the park every single week." },
  { name:"Amanda K.", event:"Corporate Gala · 180 guests", text:"The Southwestern buffet was a massive hit. Professional, friendly staff and every dish was spot on. Booking again for our holiday party." },
];

const SERVICES_INFO = [
  { id:"banquet",  label:"Banquet Service", icon:"🍽", tag:"FORMAL · PLATED",        desc:"Formal plated dinner. Guests are individually served at the table by catering staff.", minDays:5, maxMiles:25, minGuests:20 },
  { id:"buffet",   label:"Buffet",          icon:"🍖", tag:"SELF-SERVE STATION",      desc:"Self-serve station with your choice of cuisine style. Sub-type required.", minDays:5, maxMiles:25, minGuests:20 },
  { id:"coffee",   label:"Coffee Break",    icon:"☕", tag:"CORPORATE · MEETINGS",    desc:"Beverages and snacks for meetings or corporate events.", minDays:2, maxMiles:4, minGuests:10 },
  { id:"boxlunch", label:"Box Lunch",       icon:"📦", tag:"OUTDOOR · MOBILE",        desc:"Individual packaged meals per guest. Ideal for outdoor or mobile events.", minDays:2, maxMiles:4, minGuests:5 },
  { id:"foodtruck",label:"Food Truck",      icon:"🚚", tag:"OPEN TAB · POST-EVENT",   desc:"On-site truck with open menu. Guests order at the window. Billed post-event.", minDays:3, maxMiles:16, minGuests:80 },
  { id:"pickup",   label:"Pick Up",         icon:"🛍", tag:"THE CANTINITA · IN-PERSON",desc:"Order from The Cantinita restaurant menu and pick up in person. Same-day available.", minDays:0, maxMiles:Infinity, minGuests:0 },
];

const BUFFET_SUBTYPES = [
  { id:"mexican",  label:"Mexican",          emoji:"🌮" },
  { id:"italian",  label:"Italian",          emoji:"🍝" },
  { id:"oriental", label:"Oriental",         emoji:"🥢" },
  { id:"bbq",      label:"BBQ",              emoji:"🔥" },
  { id:"breakfast",label:"Breakfast / Lunch",emoji:"🍳" },
];

const BUFFET_MENUS = {
  mexican:  { proteins:["Fajita Beef / Chicken","Asado Rojo","Chile Verde","Rajas Poblanas","Carnitas Michoacanas","Carne Asada","Barbacoa","Chicharron","Mole Poblano","Cochinita Pibil","Pollo Asado","Tacos (Beef)","Tacos (Chicken)","Tacos (Pork)","Quesadillas","Sopes","Chilaquiles (Red)","Chilaquiles (Green)"], sides:["Mexican Rice","White Rice","Refried Beans","Charro Beans","Guacamole","Tex-Mex Salad","Esquites","Steamed Veggies","Mashed Potatoes","Salad"], desserts:["Flan","Tres Leches","Cheesecake","Buñuelos","Carrot Cake","Brownies","Banana Pudding"], complements:["Corn Tortilla","Flour Tortilla","Garlic Bread","Brioche Bun","Texas Toast","Sauce","Gravy","Lemons","Pico de Gallo","Sour Cream"] },
  italian:  { proteins:["Lasagna (Beef)","Chicken Parmesan","Spaghetti & Meatballs","Fettuccine Alfredo","Penne alla Vodka","Chicken Marsala","Seafood Risotto","Shrimp Scampi","Gnocchi w/ Chicken","Four-Cheese Ravioli","Carbonara","Pepperoni Pizza","3 Meat Pizza","Margarita Pizza"], sides:["Caesar Salad","Mixed Green Salad","Grilled Zucchini","Cheese Bread","Bruschetta","Caprese Salad","Pesto Pasta","Artichokes","Tomato Basil Soup","Minestrone Soup"], desserts:["Affogato","Tiramisu","Panna Cotta","Cannoli","Lemon Ricotta Cake","Fruit Tart","Nutella Pizza"], complements:["Breadsticks","Crushed Red Pepper","Italian Dressing","Parmesan Cheese","Balsamic Glaze","Marinated Olives","Olive Oil","Garlic Butter","Truffle Oil","Lemon Wedges"] },
  oriental: { proteins:["Sweet & Sour Chicken","Kung Pao Chicken","Chicken / Beef Lo Mein","Shrimp / Chicken Fried Rice","Beef & Broccoli","Teriyaki Chicken / Beef","Orange Chicken","Sesame Chicken","Crispy Pork Belly","Sushi Rolls","Beef Yakisoba","Ramen"], sides:["Steamed Rice","Seaweed Salad","Cucumber Sunomono","Vegetable Spring Rolls","Chicken Spring Rolls","Crab Rangoon","Edamame","Stir-Fried Vegetables","Wonton Soup","Tempura Vegetables"], desserts:["Green Tea Ice Cream","Fried Banana with Honey","Yuzu Cake","Sweet Potato Cake","Mango Jelly"], complements:["Soy Sauce","Low-Sodium Soy Sauce","Sweet Chili Sauce","Spicy Chili Oil","Sriracha","Teriyaki Sauce","Hoisin Sauce","Oyster Sauce","Ponzu Sauce","Wasabi"] },
  bbq:      { proteins:["Smoked Brisket","Sliced Brisket","Chopped Brisket","Pulled Pork","Pork Ribs","Beef Ribs","Smoked Sausage","Smoked Turkey Breast","Smoked Chicken","BBQ Chicken","Smoked Prime Rib","BBQ Meatloaf","Smoked Ham"], sides:["Mac and Cheese","BBQ Beans","Coleslaw","Potato Salad","Mashed Potatoes","Cornbread","Green Beans","French Fries","Garden Salad","Corn on the Cob","Pasta Salad"], desserts:["Peach Cobbler","Pecan Pie","Bread Pudding","Chocolate Cake","Brownies"], complements:["BBQ Sauce","Mustard","Pickles","Hot Sauce","Sliced White Bread","Texas Toast","Jalapeños","Honey Butter","Ketchup"] },
  breakfast:{ proteins:["Scrambled Eggs / Bacon","Scrambled Eggs / Ham","Scrambled Eggs / Chorizo","Breakfast Burritos","Migas with Chicken","Chilaquiles with Chicken","Chicken Fried Steak","Grilled Chicken Breast","Fajitas Beef","Fajitas Chicken","Tacos Pastor","Cheeseburgers","Grilled Chicken Sandwich","Quesadillas","Enchiladas Chicken"], sides:["Bacon Strips","Sausage Links","Country Ham","Biscuits","Pancakes","French Toast","Waffles","Hash Browns","Rice and Beans","Guacamole","Fruit Salad"], desserts:["Cinnamon Rolls","Banana Bread","Muffins","Sweet Pastries","Flan"], complements:["Salsa","Pico de Gallo","Hot Sauce","Butter","Honey","Maple Syrup","Whipped Cream","Jelly"] },
};

const BANQUET_MENU = {
  proteins:["Rib Eye 10oz","Porterhouse 16oz","Fillet","Cowboy","Tomahawk","Pork Chop","Picaña","Octopus Plate","Salmon Plate","Shrimp Plate","Fish Filet","Cordon Bleu","Lobster Tail","Red Snapper","Apricot Chicken","Baked Chicken / Beef Tips","Teriyaki Chicken & Beef","Chicken / Pork Marsala","Chicken / Pork Piccata","Chicken Fried Steak","Vegan Butternut Squash Pasta","Vegan Cauliflower Steaks","Vegan Black Bean Bell Peppers","Vegan Cauliflower Tacos"],
  sides:["Red Rice","White Rice","Refried Beans","Tex-Mex Salad","Guacamole","French Fries","Onion Rings","Potato Salad","Corn on the Cob","Esquites","Steamed Veggies","Mashed Potato","Coleslaw","Baked Potato","Green Beans"],
  desserts:["Flan","Tres Leches","Cheesecake","Buñuelos","Carrot Cake","Brownies","Banana Pudding"],
  complements:["Corn Tortilla","Flour Tortilla","Garlic Bread","Brioche Bun","Texas Toast","Sauce","Gravy"],
};

const COFFEE_MENU = {
  drinks:["Regular Coffee","Decaf Coffee","Espresso","Cappuccino","Latte","Sparkling Water","Bottled Water","Orange Juice","Apple Juice","Hot Tea (Assorted)","Iced Tea","Hot Chocolate","Milk"],
  savory:["Mini Sandwiches (Ham & Cheese)","Mini Sandwiches (Turkey & Cheese)","Mini Wraps (Chicken Caesar)","Mini Wraps (Vegetarian)","Cheese Platter","Mini Breakfast Tacos"],
  sweet:["Assorted Cookies","Chocolate Chip Cookies","Brownies","Mini Muffins","Croissants","Cinnamon Rolls","Granola Bars"],
  fresh:["Fruit Salad Cups","Yogurt Cups","Veggie Sticks with Dip"],
};

const BOXLUNCH_PLATES = ["Fajita Quesadilla (Chicken)","Fajita Quesadilla (Beef)","Fajita Tex-Mex (Chicken)","Fajita Tex-Mex (Beef)","Pollo Loco","Pork Carnitas","Enchiladas (Chicken)","Enchiladas (Beef)","Chilaquiles (Chicken)","Chilaquiles (Beef)","Machaca Camaron","Taco Bistec","Taco Pastor","Taco Rib Eye","Grilled Chicken Sandwich","Classic Cheeseburger"];

const BROWSE_MENU = {
  "🍳 Breakfast": ["Continental Buffet · $21/pp","All-American Buffet · $29/pp","Healthy Choices Buffet · $24/pp","Boxed Breakfast · $15/pp"],
  "🥗 Lunch": ["Boxed Lunch · $20/pp","Picnic Soup & Sandwich · $28/pp","Picnic Salad & Sandwich · $28/pp","Picnic Full · $32/pp","Plated Lunch · $38+/pp"],
  "🍽 Dinner": ["Farm to Market · $38/pp","Southern Hospitality · $42/pp","Camp Bowie Q · $35/pp","Design & Dine · $49/pp","Plated Dinner · $62+/pp"],
  "🍖 Buffets": ["Backyard Grill · $32/pp","Southwestern · $35/pp","Wok 'N Roll · $24/pp","Italiano · $47/pp","Design & Dine Buffet · $49/pp"],
  "🔪 Carving Stations": ["Pork Belly Bacon Brisket · $12/pp","Slow Roasted Prime Rib · $29/pp","Porchetta · $17/pp","Smoked Turkey Breast · $15/pp","TX Hardwood Smoked Brisket · $13/pp"],
  "🥂 Hors d'Oeuvres": ["Caprese Brochette · $4/pc","Tenderloin Toast · $5/pc","Mini Ahi Tuna Nachos · $5/pc","Prosciutto & Fig · $7/pc","Mini Crab Cakes · $8/pc","Lemongrass Chicken Pot Stickers · $4/pc","Buffalo Chicken Bites · $6/pc"],
  "🧆 Reception Displays": ["Fresh Market Crudités · $6/pp","Mezze Station · $8/pp","Chef's Cheese Board · $9/pp","Chips & Dips · $12/pp","Charcuterie & Salumi · $18/pp","Serious Sliders · $18/pp"],
  "🍹 Beverages": ["Quench Package · $10/pp","House Beer & Wine · $36/pp","Deluxe Bar · $65/pp","Ranch Water Bar · $17.50/pp/hr","Bloody Mary Bar · $16/pp/hr","Sangria Bar · $12/pp/hr"],
};

const REWARDS_TIERS = [
  { name:"Lone Ranger",  min:0,    max:499,  color:"#8B7355", perks:["1 pt per $1 spent","Birthday bonus 50pts","Priority booking"] },
  { name:"Trail Boss",   min:500,  max:1499, color:"#C46210", perks:["1 pt per $1 spent","Birthday bonus 100pts","10% off add-ons","Early menu access"] },
  { name:"Texas Legend", min:1500, max:Infinity, color:"#C8A96A", perks:["1 pt per $1 spent","Birthday bonus 200pts","15% off add-ons","Dedicated coordinator","Complimentary tasting"] },
];

function getTier(svcId, guests) {
  const g = Number(guests);
  if (["buffet","banquet"].includes(svcId)) {
    if (g >= 100) return { proteins:4, sides:4, label:"Tier 3 · 100+ Guests" };
    if (g >= 60)  return { proteins:3, sides:3, label:"Tier 2 · 60+ Guests" };
    return           { proteins:2, sides:3, label:"Tier 1 · 20+ Guests" };
  }
  if (svcId === "coffee") {
    if (g >= 60) return { drinks:4, snacks:4, label:"Tier 3 · 60+ Guests" };
    if (g >= 30) return { drinks:4, snacks:3, label:"Tier 2 · 30+ Guests" };
    return          { drinks:4, snacks:2, label:"Tier 1 · 10+ Guests" };
  }
  return null;
}

function calcDaysAhead(d) {
  if (!d) return -1;
  const now = new Date(); now.setHours(0,0,0,0);
  return Math.round((new Date(d+"T00:00:00") - now) / 86400000);
}

function validateSvc(s, info) {
  const fails = [];
  const days = calcDaysAhead(info.date), miles = parseFloat(info.miles)||0, guests = parseInt(info.guests)||0;
  if (s.minDays>0 && days<s.minDays) fails.push(`${s.minDays}+ days advance required (you have ${Math.max(0,days)})`);
  if (s.maxMiles<Infinity && miles>s.maxMiles) fails.push(`Max ${s.maxMiles} miles (entered ${miles})`);
  if (s.minGuests>0 && guests<s.minGuests) fails.push(`Min ${s.minGuests} guests required (you have ${guests})`);
  return fails;
}

function waMsg(name, svcLabel, info, fails) {
  return encodeURIComponent(`Hi, I'm ${name||info.name}. I'm interested in ${svcLabel} for ${info.guests} guests on ${info.date} at ${info.location}, Midland TX area. Issue: ${fails.join("; ")}. Can you help?`);
}

// ── STYLES ────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400;1,700&family=Great+Vibes&family=Montserrat:wght@300;400;500;600;700&display=swap');
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
:root{--blk:#1C1C1C;--org:#C46210;--org2:#D4721A;--tan:#C8A96A;--tan2:#D4B87A;--cream:#F4EFE6;--sl:#6B7280;--brn:#3E2C23;--wh:#FDFAF5;--grn:#25D366;}
html{scroll-behavior:smooth;}
body{font-family:'Montserrat',sans-serif;background:var(--cream);color:var(--blk);min-height:100vh;}

/* NAV */
.nav{position:fixed;top:0;left:0;right:0;z-index:600;display:flex;justify-content:space-between;align-items:center;padding:11px 32px;background:var(--blk);border-bottom:2px solid var(--org);}
.logo{cursor:pointer;line-height:1;}
.logo-m{font-family:'Playfair Display',serif;font-size:1.3rem;font-weight:900;color:var(--wh);text-transform:uppercase;letter-spacing:.04em;}
.logo-m span{color:var(--org);}
.logo-s{font-family:'Great Vibes',cursive;font-size:.82rem;color:var(--tan);display:block;margin-top:-2px;}
.nav-links{display:flex;gap:3px;align-items:center;flex-wrap:wrap;}
.nb{background:none;border:none;font-family:'Montserrat',sans-serif;font-size:.62rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.45);cursor:pointer;padding:7px 11px;border-radius:2px;transition:all .2s;white-space:nowrap;}
.nb:hover,.nb.act{color:var(--tan);}
.nb.cta{background:var(--org);color:white!important;}
.nb.cta:hover{background:var(--org2);}
.pts-pill{background:rgba(196,98,16,.25);color:var(--tan);border-radius:20px;padding:4px 10px;font-size:.58rem;font-weight:700;letter-spacing:.08em;}

/* HERO */
.hero{min-height:100vh;display:flex;align-items:center;padding:120px 56px 80px;background:var(--blk);overflow:hidden;position:relative;}
.hero-star{position:absolute;right:-4%;top:50%;transform:translateY(-50%);font-size:55vw;opacity:.03;color:var(--org);pointer-events:none;}
.hero-lines{position:absolute;inset:0;pointer-events:none;background:repeating-linear-gradient(0deg,transparent,transparent 60px,rgba(196,98,16,.04) 60px,rgba(196,98,16,.04) 61px);}
.hero-content{max-width:680px;z-index:2;}
.hero-eye{display:flex;align-items:center;gap:10px;margin-bottom:18px;}
.hero-eye span{font-size:.62rem;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:var(--tan);}
.hero h1{font-family:'Playfair Display',serif;font-size:clamp(3rem,7vw,6rem);font-weight:900;color:var(--wh);line-height:.95;text-transform:uppercase;margin-bottom:6px;}
.hero h1 .acc{color:var(--org);}
.hero-script{font-family:'Great Vibes',cursive;font-size:clamp(1.6rem,3.5vw,2.6rem);color:var(--tan);display:block;margin-bottom:18px;}
.hero-tag{font-size:.65rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,.28);margin-bottom:32px;display:flex;align-items:center;gap:10px;}
.hero-tag::before,.hero-tag::after{content:'';flex:0 0 32px;height:1px;background:var(--org);opacity:.5;}
.hero p{font-size:.88rem;color:rgba(255,255,255,.48);line-height:1.85;max-width:480px;margin-bottom:36px;font-weight:300;}
.hero-btns{display:flex;gap:10px;flex-wrap:wrap;}
.btn-p{background:var(--org);color:white;border:none;padding:13px 26px;font-family:'Montserrat',sans-serif;font-size:.68rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;cursor:pointer;border-radius:2px;transition:background .2s;}
.btn-p:hover{background:var(--org2);}
.btn-o{background:transparent;color:var(--tan);border:1.5px solid var(--tan);padding:13px 26px;font-family:'Montserrat',sans-serif;font-size:.68rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;cursor:pointer;border-radius:2px;transition:all .2s;}
.btn-o:hover{background:var(--tan);color:var(--blk);}

/* BANNER */
.banner{background:var(--org);padding:11px 32px;display:flex;justify-content:center;gap:24px;flex-wrap:wrap;}
.banner-i{font-size:.6rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:white;display:flex;align-items:center;gap:7px;white-space:nowrap;}

/* STATS */
.stats{background:var(--brn);padding:44px 32px;display:flex;justify-content:center;gap:56px;flex-wrap:wrap;border-top:1px solid rgba(196,98,16,.3);border-bottom:1px solid rgba(196,98,16,.3);}
.stat{text-align:center;}
.stat-n{font-family:'Playfair Display',serif;font-size:2.6rem;font-weight:900;color:var(--tan);display:block;line-height:1;}
.stat-l{font-size:.58rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,.3);margin-top:5px;}

/* SECTION */
.sec{padding:72px 56px;max-width:1280px;margin:0 auto;}
.sec-eye{font-size:.6rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:var(--org);margin-bottom:8px;display:flex;align-items:center;gap:7px;}
.sec-eye::before{content:'★';font-size:.5rem;}
.sec-h{font-family:'Playfair Display',serif;font-size:clamp(1.8rem,3.5vw,2.8rem);font-weight:900;line-height:1.1;text-transform:uppercase;margin-bottom:8px;}
.sec-sub{color:var(--sl);font-size:.84rem;line-height:1.8;font-weight:300;margin-bottom:40px;max-width:520px;}

/* SERVICES GRID */
.svc-home-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:2px;background:var(--blk);border:2px solid var(--blk);}
.svc-home-card{background:var(--cream);padding:30px 24px;transition:background .2s;}
.svc-home-card:hover{background:var(--wh);}
.shc-icon{font-size:1.8rem;margin-bottom:12px;}
.shc-title{font-family:'Playfair Display',serif;font-size:1.15rem;font-weight:700;text-transform:uppercase;margin-bottom:7px;}
.shc-desc{font-size:.78rem;color:var(--sl);line-height:1.7;font-weight:300;}
.shc-tag{display:inline-block;margin-top:10px;font-size:.56rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--org);}

/* TESTIMONIALS */
.testi-wrap{background:var(--blk);padding:64px 56px;border-top:3px solid var(--org);}
.testi-inner{max-width:1280px;margin:0 auto;}
.testi-hd{text-align:center;margin-bottom:44px;}
.testi-hd h2{font-family:'Playfair Display',serif;font-size:2.2rem;font-weight:900;color:var(--wh);text-transform:uppercase;}
.testi-script{font-family:'Great Vibes',cursive;font-size:1.5rem;color:var(--tan);display:block;margin-top:2px;}
.testi-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:2px;background:rgba(196,98,16,.2);}
.testi-card{background:var(--brn);padding:26px;}
.testi-q{font-size:2.6rem;color:var(--org);line-height:.8;margin-bottom:8px;font-family:'Playfair Display',serif;opacity:.3;}
.testi-t{font-family:'Playfair Display',serif;font-size:.9rem;font-style:italic;color:rgba(255,255,255,.75);line-height:1.75;margin-bottom:14px;}
.testi-n{font-size:.6rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--tan);}
.testi-e{font-size:.58rem;color:rgba(255,255,255,.25);margin-top:2px;}

/* CTA */
.cta-sec{background:var(--org);padding:60px 56px;text-align:center;}
.cta-sec h2{font-family:'Playfair Display',serif;font-size:2.4rem;font-weight:900;color:white;text-transform:uppercase;margin-bottom:4px;}
.cta-script{font-family:'Great Vibes',cursive;font-size:1.7rem;color:rgba(255,255,255,.65);display:block;margin-bottom:22px;}
.cta-btns{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;}
.btn-dk{background:var(--blk);color:white;border:none;padding:13px 26px;font-family:'Montserrat',sans-serif;font-size:.68rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;cursor:pointer;border-radius:2px;transition:background .2s;}
.btn-dk:hover{background:var(--brn);}
.btn-wh{background:white;color:var(--org);border:none;padding:13px 26px;font-family:'Montserrat',sans-serif;font-size:.68rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;cursor:pointer;border-radius:2px;transition:all .2s;}
.btn-wh:hover{background:var(--cream);}

/* FOOTER */
.footer{background:var(--blk);padding:40px 56px;border-top:2px solid var(--org);}
.footer-inner{max-width:1280px;margin:0 auto;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:18px;}
.footer-logo{font-family:'Playfair Display',serif;font-size:1.15rem;font-weight:900;color:var(--wh);text-transform:uppercase;}
.footer-logo span{color:var(--org);}
.footer-script{font-family:'Great Vibes',cursive;font-size:.9rem;color:var(--tan);}
.footer-info{font-size:.65rem;color:rgba(255,255,255,.25);line-height:1.9;text-align:right;}

/* PAGE HEADER */
.ph{background:var(--blk);padding:96px 56px 32px;border-bottom:3px solid var(--org);}
.ph-inner{max-width:1100px;margin:0 auto;}
.ph-step{font-size:.58rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:var(--org);margin-bottom:5px;}
.ph h1{font-family:'Playfair Display',serif;font-size:clamp(1.8rem,4vw,3.2rem);font-weight:900;color:var(--wh);text-transform:uppercase;line-height:1;}
.ph h1 span{color:var(--org);}
.ph-script{font-family:'Great Vibes',cursive;font-size:1.3rem;color:var(--tan);display:block;margin-top:4px;}
.ph p{font-size:.74rem;color:rgba(255,255,255,.36);margin-top:8px;font-weight:300;}

/* ORDER FLOW */
.order-wrap{padding-top:68px;min-height:100vh;}
.order-pg{max-width:980px;margin:0 auto;padding:32px 24px 100px;}
.form-card{background:var(--wh);border:2px solid #E5DDD0;padding:26px;margin-bottom:10px;}
.fc-t{font-family:'Playfair Display',serif;font-size:1rem;font-weight:700;text-transform:uppercase;margin-bottom:14px;display:flex;align-items:center;gap:7px;}
.fc-t::before{content:'★';color:var(--org);font-size:.54rem;}
.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
.fg{display:flex;flex-direction:column;gap:5px;}
.fg.full{grid-column:1/-1;}
.flabel{font-size:.58rem;font-weight:700;letter-spacing:.11em;text-transform:uppercase;color:var(--sl);}
.finput{padding:9px 12px;border:1.5px solid #ddd;background:white;font-family:'Montserrat',sans-serif;font-size:.83rem;border-radius:2px;color:var(--blk);transition:border-color .2s;width:100%;}
.finput:focus{outline:none;border-color:var(--org);}
.finput.err{border-color:#e53e3e;}
.err-m{font-size:.6rem;color:#e53e3e;font-weight:600;}
.svc-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
.svc-card{background:var(--wh);border:2px solid #E5DDD0;padding:18px;cursor:pointer;transition:all .18s;position:relative;}
.svc-card:hover{border-color:var(--org);background:var(--cream);}
.svc-card.sel{border-color:var(--org);background:rgba(196,98,16,.05);}
.svc-icon{font-size:1.7rem;margin-bottom:7px;}
.svc-name{font-family:'Playfair Display',serif;font-size:1.05rem;font-weight:700;text-transform:uppercase;margin-bottom:2px;}
.svc-tag-s{font-size:.54rem;font-weight:700;letter-spacing:.09em;text-transform:uppercase;color:var(--org);margin-bottom:5px;}
.svc-desc{font-size:.7rem;color:var(--sl);line-height:1.5;font-weight:300;}
.svc-fail{margin-top:7px;font-size:.64rem;color:#e53e3e;font-weight:600;line-height:1.4;}
.svc-chk{position:absolute;top:10px;right:10px;width:20px;height:20px;background:var(--org);border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:.65rem;}
.wa-btn{display:flex;align-items:center;gap:7px;background:var(--grn);color:white;border:none;padding:8px 14px;font-family:'Montserrat',sans-serif;font-size:.62rem;font-weight:700;letter-spacing:.09em;text-transform:uppercase;cursor:pointer;border-radius:2px;margin-top:8px;transition:background .2s;}
.wa-btn:hover{background:#1ebe5d;}
.sub-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:7px;margin-bottom:14px;}
.sub-card{background:var(--wh);border:2px solid #E5DDD0;padding:12px 6px;cursor:pointer;text-align:center;transition:all .15s;border-radius:2px;}
.sub-card:hover,.sub-card.sel{border-color:var(--org);background:rgba(196,98,16,.05);}
.sub-icon{font-size:1.5rem;margin-bottom:4px;}
.sub-lbl{font-size:.58rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--sl);}
.sub-card.sel .sub-lbl{color:var(--org);}
.tier-badge{background:var(--blk);color:var(--tan);font-size:.6rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;padding:6px 14px;display:inline-flex;align-items:center;gap:6px;margin-bottom:16px;}
.tier-badge::before{content:'★';color:var(--org);}
.menu-sec{margin-bottom:16px;}
.ms-hd{display:flex;justify-content:space-between;align-items:baseline;padding:9px 13px;background:var(--blk);}
.ms-t{font-size:.6rem;font-weight:700;letter-spacing:.13em;text-transform:uppercase;color:var(--tan);}
.ms-q{font-size:.6rem;font-weight:700;color:var(--org);}
.ms-items{display:flex;flex-direction:column;gap:2px;}
.ms-item{background:var(--wh);padding:9px 13px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;border-left:3px solid transparent;transition:all .14s;font-size:.8rem;}
.ms-item:hover{border-left-color:var(--tan);background:var(--cream);}
.ms-item.on{border-left-color:var(--org);background:rgba(196,98,16,.06);}
.ms-item.dis{opacity:.32;cursor:not-allowed;}
.ms-item.on .ms-chk{opacity:1;}
.ms-chk{opacity:0;color:var(--org);font-size:.7rem;font-weight:900;}
.ms-inc{font-size:.58rem;color:var(--sl);font-weight:600;letter-spacing:.05em;}
.bottom-bar{position:fixed;bottom:0;left:0;right:0;z-index:500;background:var(--blk);border-top:2px solid var(--org);padding:13px 32px;display:flex;justify-content:space-between;align-items:center;gap:14px;}
.bb-sum{color:rgba(255,255,255,.4);font-size:.72rem;}
.bb-sum strong{color:var(--tan);}
.bb-btns{display:flex;gap:7px;}
.btn-back{background:transparent;border:1.5px solid rgba(196,98,16,.4);color:var(--tan);font-family:'Montserrat',sans-serif;font-size:.64rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;padding:9px 18px;cursor:pointer;border-radius:2px;transition:all .2s;}
.btn-back:hover{border-color:var(--org);color:white;}
.btn-next{background:var(--org);color:white;border:none;padding:9px 22px;font-family:'Montserrat',sans-serif;font-size:.64rem;font-weight:700;letter-spacing:.11em;text-transform:uppercase;cursor:pointer;border-radius:2px;transition:background .2s;}
.btn-next:hover{background:var(--org2);}
.btn-next:disabled{opacity:.3;cursor:not-allowed;}
.confirm-box{background:var(--blk);border:2px solid var(--org);padding:40px;text-align:center;}
.confirm-icon{font-size:3rem;margin-bottom:12px;}
.confirm-box h2{font-family:'Playfair Display',serif;font-size:1.9rem;font-weight:900;text-transform:uppercase;color:var(--wh);margin-bottom:4px;}
.confirm-script{font-family:'Great Vibes',cursive;font-size:1.4rem;color:var(--tan);display:block;margin-bottom:14px;}
.confirm-detail{background:rgba(196,98,16,.1);border:1px solid rgba(196,98,16,.22);padding:14px;margin:18px 0;text-align:left;}
.cd-row{display:flex;justify-content:space-between;padding:4px 0;font-size:.74rem;border-bottom:1px solid rgba(255,255,255,.05);}
.cd-row:last-child{border-bottom:none;}
.cd-l{color:rgba(255,255,255,.36);font-weight:600;}
.cd-v{color:var(--tan);font-weight:700;}
.confirm-box p{color:rgba(255,255,255,.42);font-size:.78rem;line-height:1.75;max-width:440px;margin:0 auto;}
.btn-restart{background:var(--org);color:white;border:none;padding:12px 26px;font-family:'Montserrat',sans-serif;font-size:.68rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;cursor:pointer;border-radius:2px;margin-top:18px;transition:background .2s;}
.btn-restart:hover{background:var(--org2);}

/* BROWSE MENU */
.browse-wrap{padding-top:68px;min-height:100vh;}
.browse-pg{max-width:900px;margin:0 auto;padding:32px 24px 60px;}
.browse-cat{margin-bottom:22px;}
.bc-title{font-size:.6rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--org);padding:8px 14px;background:var(--blk);margin-bottom:2px;display:flex;align-items:center;gap:7px;}
.bc-item{background:var(--wh);padding:12px 14px;font-size:.82rem;border-bottom:1px solid #f0e8dc;border-left:3px solid transparent;transition:all .14s;display:flex;justify-content:space-between;align-items:center;}
.bc-item:hover{border-left-color:var(--org);background:var(--cream);}
.bc-price{font-size:.7rem;font-weight:700;color:var(--org);}

/* REWARDS */
.rewards-wrap{padding-top:68px;min-height:100vh;}
.rewards-pg{max-width:900px;margin:0 auto;padding:32px 24px 60px;}
.pts-hero{background:var(--blk);border:2px solid var(--org);padding:32px;text-align:center;margin-bottom:20px;}
.pts-num{font-family:'Playfair Display',serif;font-size:4rem;font-weight:900;color:var(--tan);line-height:1;}
.pts-label{font-size:.6rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,.35);margin-top:4px;}
.pts-script{font-family:'Great Vibes',cursive;font-size:1.4rem;color:var(--org);display:block;margin-top:6px;}
.pts-redeem{margin-top:14px;display:flex;gap:8px;justify-content:center;flex-wrap:wrap;}
.tier-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:20px;}
.tier-card{border:2px solid;padding:20px;position:relative;overflow:hidden;}
.tier-card.active-tier::after{content:'YOUR TIER';position:absolute;top:9px;right:-22px;background:var(--org);color:white;font-size:.48rem;font-weight:700;letter-spacing:.1em;padding:3px 28px;transform:rotate(45deg);}
.tier-name{font-family:'Playfair Display',serif;font-size:1.1rem;font-weight:900;text-transform:uppercase;margin-bottom:4px;}
.tier-range{font-size:.6rem;font-weight:700;color:rgba(0,0,0,.4);letter-spacing:.06em;margin-bottom:12px;}
.tier-perk{font-size:.72rem;color:rgba(0,0,0,.55);line-height:1.6;display:flex;align-items:baseline;gap:5px;margin-bottom:3px;}
.tier-perk::before{content:'★';color:var(--org);font-size:.5rem;flex-shrink:0;}
.redeem-card{background:var(--wh);border:2px solid #E5DDD0;padding:18px;margin-bottom:10px;}
.rc-head{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:5px;}
.rc-t{font-family:'Playfair Display',serif;font-size:1rem;font-weight:700;text-transform:uppercase;}
.rc-cost{font-size:.65rem;font-weight:700;color:var(--org);}
.rc-desc{font-size:.76rem;color:var(--sl);font-weight:300;margin-bottom:10px;}
.btn-redeem{background:var(--org);color:white;border:none;padding:8px 18px;font-family:'Montserrat',sans-serif;font-size:.62rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;border-radius:2px;transition:background .2s;}
.btn-redeem:hover{background:var(--org2);}
.btn-redeem:disabled{opacity:.3;cursor:not-allowed;}

/* ACCOUNT */
.acct-wrap{padding-top:68px;min-height:100vh;}
.acct-pg{max-width:900px;margin:0 auto;padding:32px 24px 60px;}
.acct-grid{display:grid;grid-template-columns:280px 1fr;gap:14px;}
.acct-side{display:flex;flex-direction:column;gap:10px;}
.acct-card{background:var(--wh);border:2px solid #E5DDD0;padding:20px;}
.acct-avatar{width:60px;height:60px;background:var(--org);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.6rem;color:white;margin-bottom:12px;}
.acct-name{font-family:'Playfair Display',serif;font-size:1.1rem;font-weight:700;text-transform:uppercase;}
.acct-email{font-size:.7rem;color:var(--sl);margin-bottom:10px;}
.acct-pts{display:inline-flex;align-items:center;gap:5px;background:rgba(196,98,16,.1);border:1px solid rgba(196,98,16,.25);padding:5px 10px;font-size:.64rem;font-weight:700;color:var(--org);letter-spacing:.06em;}
.acct-tier-badge{font-size:.58rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;padding:4px 10px;border-radius:2px;color:white;margin-top:6px;display:inline-block;}
.order-row{background:var(--wh);border:2px solid #E5DDD0;padding:14px 18px;margin-bottom:6px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;}
.or-id{font-family:'Playfair Display',serif;font-size:.95rem;font-weight:700;}
.or-svc{font-size:.72rem;color:var(--sl);margin-top:1px;}
.or-date{font-size:.64rem;color:var(--sl);}
.or-total{font-size:.88rem;font-weight:700;color:var(--org);}
.or-pts{font-size:.62rem;font-weight:700;color:var(--tan);}
.or-status{font-size:.58rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;padding:3px 8px;border-radius:2px;}
.or-status.comp{background:rgba(34,197,94,.15);color:#16a34a;}
.or-status.upco{background:rgba(196,98,16,.15);color:var(--org);}
.acct-nav{display:flex;flex-direction:column;gap:2px;}
.an-btn{background:none;border:none;text-align:left;padding:10px 14px;font-family:'Montserrat',sans-serif;font-size:.7rem;font-weight:600;cursor:pointer;border-left:3px solid transparent;transition:all .15s;color:var(--blk);}
.an-btn:hover,.an-btn.act{border-left-color:var(--org);color:var(--org);background:rgba(196,98,16,.05);}
.logout-btn{background:none;border:1.5px solid rgba(196,98,16,.3);color:var(--sl);font-family:'Montserrat',sans-serif;font-size:.62rem;font-weight:700;letter-spacing:.09em;text-transform:uppercase;padding:8px 14px;cursor:pointer;border-radius:2px;transition:all .2s;width:100%;margin-top:4px;}
.logout-btn:hover{border-color:var(--org);color:var(--org);}

/* LOGIN */
.login-wrap{padding-top:68px;min-height:100vh;display:flex;align-items:center;justify-content:center;padding-bottom:40px;}
.login-box{background:var(--blk);border:2px solid var(--org);padding:40px;width:100%;max-width:420px;}
.login-box h2{font-family:'Playfair Display',serif;font-size:1.8rem;font-weight:900;color:var(--wh);text-transform:uppercase;margin-bottom:4px;}
.login-script{font-family:'Great Vibes',cursive;font-size:1.3rem;color:var(--tan);display:block;margin-bottom:22px;}
.login-form{display:flex;flex-direction:column;gap:10px;}
.login-input{padding:10px 13px;border:1.5px solid rgba(196,98,16,.3);background:rgba(255,255,255,.05);font-family:'Montserrat',sans-serif;font-size:.84rem;border-radius:2px;color:white;transition:border-color .2s;}
.login-input::placeholder{color:rgba(255,255,255,.28);}
.login-input:focus{outline:none;border-color:var(--org);}
.login-err{font-size:.7rem;color:#fc8181;font-weight:600;}
.btn-login{background:var(--org);color:white;border:none;padding:12px;font-family:'Montserrat',sans-serif;font-size:.7rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;cursor:pointer;border-radius:2px;transition:background .2s;}
.btn-login:hover{background:var(--org2);}
.login-hint{font-size:.65rem;color:rgba(255,255,255,.28);margin-top:10px;line-height:1.6;}

/* NOTIFY TOAST */
.toast{position:fixed;bottom:90px;right:24px;z-index:700;background:var(--blk);border:2px solid var(--org);color:var(--tan);padding:12px 18px;font-size:.72rem;font-weight:700;letter-spacing:.06em;border-radius:2px;animation:slideIn .3s ease;}
@keyframes slideIn{from{transform:translateY(20px);opacity:0;}to{transform:translateY(0);opacity:1;}}

@media(max-width:768px){
  .nav{padding:10px 14px;}
  .hero,.sec,.testi-wrap,.cta-sec,.footer{padding-left:16px;padding-right:16px;}
  .hero h1{font-size:2.8rem;}
  .hero-star{display:none;}
  .svc-home-grid,.testi-grid,.tier-cards{grid-template-columns:1fr;}
  .svc-grid{grid-template-columns:1fr;}
  .sub-grid{grid-template-columns:repeat(3,1fr);}
  .form-grid{grid-template-columns:1fr;}
  .acct-grid{grid-template-columns:1fr;}
  .ph,.browse-pg,.rewards-pg,.acct-pg,.order-pg{padding-left:14px;padding-right:14px;}
  .ph{padding-top:80px;}
  .bottom-bar{padding:11px 14px;}
  .footer-inner{flex-direction:column;}
  .footer-info{text-align:left;}
  .stats{gap:28px;padding:32px 14px;}
}
`;

// ── APP ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage]       = useState("home");
  const [user, setUser]       = useState(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPw, setLoginPw]   = useState("");
  const [loginErr, setLoginErr]  = useState("");
  const [acctTab, setAcctTab]   = useState("orders");
  const [toast, setToast]       = useState(null);

  // order flow
  const [oStep, setOStep]   = useState(1);
  const [oDone, setODone]   = useState(false);
  const [oInfo, setOInfo]   = useState({ name:"", guests:"", date:"", time:"", location:"", miles:"" });
  const [oErr, setOErr]     = useState({});
  const [oSvc, setOSvc]     = useState(null);
  const [oSub, setOSub]     = useState(null);
  const [oSel, setOSel]     = useState({ proteins:[], sides:[], desserts:[], drinks:[], snacks:[], plate:[], complements:[] });

  const selSvc = SERVICES_INFO.find(s => s.id === oSvc);
  const tier   = oSvc ? getTier(oSvc, oInfo.guests) : null;
  const menu   = oSvc === "buffet" && oSub ? BUFFET_MENUS[oSub] : oSvc === "banquet" ? BANQUET_MENU : null;

  function showToast(msg) { setToast(msg); setTimeout(()=>setToast(null), 2800); }
  function go(p) { setPage(p); window.scrollTo(0,0); }

  function resetOrder() {
    setOStep(1); setODone(false); setOSvc(null); setOSub(null);
    setOInfo({ name:"", guests:"", date:"", time:"", location:"", miles:"" });
    setOErr({}); setOSel({ proteins:[], sides:[], desserts:[], drinks:[], snacks:[], plate:[], complements:[] });
  }

  function validateInfo() {
    const e = {};
    if (!oInfo.name.trim())    e.name     = "Required";
    if (!oInfo.guests || isNaN(+oInfo.guests) || +oInfo.guests < 1) e.guests = "Enter valid guest count";
    if (!oInfo.date)           e.date     = "Required";
    if (!oInfo.time)           e.time     = "Required";
    if (!oInfo.location.trim()) e.location= "Required";
    setOErr(e); return Object.keys(e).length === 0;
  }

  function toggleSel(cat, item, max) {
    setOSel(prev => {
      const arr = prev[cat] || [];
      if (arr.includes(item)) return { ...prev, [cat]: arr.filter(x=>x!==item) };
      if (max && arr.length >= max) return prev;
      return { ...prev, [cat]: [...arr, item] };
    });
  }

  useEffect(() => {
    setOSel({ proteins:[], sides:[], desserts:[], drinks:[], snacks:[], plate:[], complements:[] });
  }, [oSvc, oSub]);

  function doLogin() {
    const u = MOCK_USERS[loginEmail.toLowerCase()];
    if (!u || u.password !== loginPw) { setLoginErr("Invalid email or password. Try demo@cantinita.com / demo"); return; }
    setUser({ ...u, email: loginEmail.toLowerCase() });
    setLoginErr(""); setLoginEmail(""); setLoginPw("");
    go("account"); showToast("Welcome back, " + u.name.split(" ")[0] + "! 🤠");
  }

  function doRedeem(cost, label) {
    if (!user || user.points < cost) return;
    setUser(prev => ({ ...prev, points: prev.points - cost }));
    showToast(`✓ ${label} redeemed!`);
  }

  const userTier = user ? REWARDS_TIERS.find((t,i,arr) => user.points >= t.min && (i === arr.length-1 || user.points < arr[i+1].min)) : null;

  function MenuSec({ cat, title, items, max, included }) {
    const sel = oSel[cat] || [];
    return (
      <div className="menu-sec">
        <div className="ms-hd"><span className="ms-t">{title}</span><span className="ms-q">{included?"Included":max?`${sel.length}/${max}`:`${sel.length} selected`}</span></div>
        <div className="ms-items">
          {items.map(item => {
            const on = included || sel.includes(item);
            const atMax = !included && max && sel.length >= max && !sel.includes(item);
            return (
              <div key={item} className={`ms-item ${on?"on":""} ${atMax?"dis":""}`}
                onClick={()=>!included && !atMax && toggleSel(cat, item, max)}>
                <span>{item}</span>
                {included ? <span className="ms-inc">INCLUDED</span> : <span className="ms-chk">✓</span>}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const step2Valid = !!oSvc && (oSvc !== "buffet" || !!oSub);

  function goNext() {
    if (oStep===1) { if (validateInfo()) setOStep(2); return; }
    if (oStep===2) { if (oSvc==="foodtruck") { setODone(true); return; } setOStep(3); return; }
    setODone(true);
  }

// ── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{CSS}</style>
      {toast && <div className="toast">{toast}</div>}

      {/* NAV */}
      <nav className="nav">
        <div className="logo" onClick={()=>go("home")}>
          <span className="logo-m">Lone<span>star</span></span>
          <span className="logo-s">by the Cantinita · Midland, TX</span>
        </div>
        <div className="nav-links">
          <button className={`nb ${page==="home"?"act":""}`} onClick={()=>go("home")}>Home</button>
          <button className={`nb ${page==="menu"?"act":""}`} onClick={()=>go("menu")}>Menu</button>
          <button className={`nb ${page==="rewards"?"act":""}`} onClick={()=>go("rewards")}>
            Rewards {user && <span className="pts-pill">{user.points}pts</span>}
          </button>
          <button className={`nb ${page==="account"?"act":""}`} onClick={()=>go(user?"account":"login")}>
            {user ? user.name.split(" ")[0] : "Sign In"}
          </button>
          <button className="nb cta" onClick={()=>{ resetOrder(); go("order"); }}>Order Now</button>
        </div>
      </nav>

      {/* ── HOME ── */}
      {page==="home" && (<>
        <section className="hero">
          <div className="hero-lines"/><div className="hero-star">★</div>
          <div className="hero-content">
            <div className="hero-eye"><span>★</span><span>Midland, Texas · Since 1998</span></div>
            <h1>LONE<span className="acc">STAR</span><br/>CATERING</h1>
            <span className="hero-script">by the Cantinita</span>
            <div className="hero-tag">Texas Hospitality at Your Table</div>
            <p>Real Texas BBQ & Tex-Mex, slow-smoked and made with pride. From breakfast buffets and boxed lunches to plated gala dinners — we bring the heart of the Permian Basin to every event.</p>
            <div className="hero-btns">
              <button className="btn-p" onClick={()=>{ resetOrder(); go("order"); }}>Order Now</button>
              <button className="btn-o" onClick={()=>go("menu")}>Browse Menu</button>
            </div>
          </div>
        </section>
        <div className="banner">
          {["BBQ & Tex-Mex","Weddings","Corporate Events","Oilfield & Crew Meals","Private Parties","Midland · Odessa · Permian Basin"].map((item,i)=>(
            <div className="banner-i" key={item}>{i>0&&<span style={{color:"rgba(255,255,255,.4)"}}>★</span>}{item}</div>
          ))}
        </div>
        <div className="stats">
          {[["2,400+","Events Catered"],["98%","Client Satisfaction"],["25","Years in West Texas"],["12","Pitmasters & Chefs"]].map(([n,l])=>(
            <div className="stat" key={l}><span className="stat-n">{n}</span><span className="stat-l">{l}</span></div>
          ))}
        </div>
        <section className="sec">
          <div className="sec-eye">What We Do</div>
          <h2 className="sec-h">Catering for Every Occasion</h2>
          <p className="sec-sub">From oilfield crews to black-tie galas — authentic Texas flavors with genuine West Texas hospitality.</p>
          <div className="svc-home-grid">
            {[
              { icon:"💒", title:"Weddings & Quinceañeras", desc:"Make your most important day unforgettable with slow-smoked brisket, sizzling fajitas, and a full Tex-Mex spread.", tag:"Full-Service Available" },
              { icon:"🏢", title:"Corporate & Oilfield", desc:"Hot, hearty meals delivered on time to any Permian Basin site. Breakfast buffets, boxed lunches, dinner buffets — crews of 20 to 500.", tag:"Any Location · Any Size" },
              { icon:"🎉", title:"Private Parties", desc:"Birthday bashes, reunions, backyard BBQs, holiday parties — we bring the pit and Texas hospitality to your door.", tag:"Setup & Cleanup Included" },
            ].map(s=>(
              <div className="svc-home-card" key={s.title}>
                <div className="shc-icon">{s.icon}</div>
                <div className="shc-title">{s.title}</div>
                <p className="shc-desc">{s.desc}</p>
                <span className="shc-tag">★ {s.tag}</span>
              </div>
            ))}
          </div>
        </section>
        <div className="testi-wrap">
          <div className="testi-inner">
            <div className="testi-hd"><h2>Don't Take Our Word For It</h2><span className="testi-script">hear it from our guests</span></div>
            <div className="testi-grid">
              {TESTIMONIALS.map(t=>(
                <div className="testi-card" key={t.name}>
                  <div className="testi-q">"</div>
                  <p className="testi-t">{t.text}</p>
                  <div className="testi-n">{t.name}</div>
                  <div className="testi-e">{t.event}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="cta-sec">
          <h2>Ready to Feed Your Crowd?</h2>
          <span className="cta-script">let's make it legendary</span>
          <div className="cta-btns">
            <button className="btn-dk" onClick={()=>{ resetOrder(); go("order"); }}>Start Your Order</button>
            <button className="btn-wh" onClick={()=>go("menu")}>Browse Full Menu</button>
          </div>
        </div>
        <footer className="footer">
          <div className="footer-inner">
            <div>
              <div className="footer-logo">Lone<span>star</span> Catering</div>
              <div className="footer-script">by the Cantinita</div>
            </div>
            <div className="footer-info">
              <div>info@lonestarcatering.com</div>
              <div>(432) 555-0100 · Midland, Texas 79701</div>
              <div>Serving the Permian Basin · Midland · Odessa · Andrews</div>
              <div style={{marginTop:4,fontSize:".56rem",opacity:.4}}>© 2025 Lonestar Catering by the Cantinita. All rights reserved.</div>
            </div>
          </div>
        </footer>
      </>)}

      {/* ── BROWSE MENU ── */}
      {page==="menu" && (
        <div className="browse-wrap">
          <div className="ph">
            <div className="ph-inner">
              <div className="ph-step">★ Full Menu</div>
              <h1>Our <span>Menu</span></h1>
              <span className="ph-script">slow-smoked & made with pride</span>
              <p>★ Prices per person unless noted · Final quote after consultation · Midland, TX · (432) 555-0100</p>
            </div>
          </div>
          <div className="browse-pg">
            <div style={{marginBottom:18,display:"flex",gap:10}}>
              <button className="btn-p" onClick={()=>{ resetOrder(); go("order"); }}>★ Place an Order</button>
            </div>
            {Object.entries(BROWSE_MENU).map(([cat, items])=>(
              <div className="browse-cat" key={cat}>
                <div className="bc-title">{cat}</div>
                {items.map(item => {
                  const parts = item.split(" · ");
                  return (
                    <div className="bc-item" key={item}>
                      <span>{parts[0]}</span>
                      {parts[1] && <span className="bc-price">{parts[1]}</span>}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── ORDER NOW ── */}
      {page==="order" && (
        <div className="order-wrap">
          <div className="ph">
            <div className="ph-inner">
              <div className="ph-step">
                {oDone ? "✓ Complete" : `★ Step ${oStep} of 3 — ${["Event Details","Choose Service","Build Menu"][oStep-1]}`}
              </div>
              <h1>{oDone ? <>Order <span>Submitted</span></> : oStep===1 ? <>Event <span>Details</span></> : oStep===2 ? <>Service <span>Type</span></> : <>Build Your <span>Menu</span></>}</h1>
              {!oDone && <p>★ Serving Midland, Odessa & the Permian Basin · (432) 555-0100</p>}
            </div>
          </div>

          <div className="order-pg">
            {oDone ? (
              <div className="confirm-box">
                <div className="confirm-icon">🤠</div>
                <h2>Yeehaw!</h2>
                <span className="confirm-script">order received</span>
                <div className="confirm-detail">
                  {[["Name / Company",oInfo.name],["Guests",oInfo.guests],["Date",oInfo.date],["Time",oInfo.time],["Location",oInfo.location],["Service",selSvc?.label],oSub&&["Buffet Style",BUFFET_SUBTYPES.find(b=>b.id===oSub)?.label]].filter(Boolean).map(([l,v])=>(
                    <div className="cd-row" key={l}><span className="cd-l">{l}</span><span className="cd-v">{v}</span></div>
                  ))}
                </div>
                <p>We'll reach out within 24 hours to confirm your event details and finalize your quote. Texas hospitality guaranteed.</p>
                {user && <p style={{marginTop:10,color:"var(--tan)",fontSize:".74rem",fontWeight:700}}>★ Points will be added to your account after your event.</p>}
                <button className="btn-restart" onClick={()=>{ resetOrder(); }}>Place Another Order</button>
              </div>
            ) : oStep===1 ? (
              <div className="form-card">
                <div className="fc-t">Event Information</div>
                <div className="form-grid">
                  <div className="fg full"><label className="flabel">Name / Company *</label><input className={`finput ${oErr.name?"err":""}`} placeholder="Jane Smith / Acme Corp" value={oInfo.name} onChange={e=>setOInfo({...oInfo,name:e.target.value})} />{oErr.name&&<span className="err-m">{oErr.name}</span>}</div>
                  <div className="fg"><label className="flabel">Guest Count * <span style={{color:"var(--org)"}}>→ unlocks menu tier</span></label><input className={`finput ${oErr.guests?"err":""}`} type="number" min={1} placeholder="e.g. 75" value={oInfo.guests} onChange={e=>setOInfo({...oInfo,guests:e.target.value})} />{oErr.guests&&<span className="err-m">{oErr.guests}</span>}</div>
                  <div className="fg"><label className="flabel">Event Date *</label><input className={`finput ${oErr.date?"err":""}`} type="date" value={oInfo.date} onChange={e=>setOInfo({...oInfo,date:e.target.value})} />{oErr.date&&<span className="err-m">{oErr.date}</span>}</div>
                  <div className="fg"><label className="flabel">Event Time *</label><input className={`finput ${oErr.time?"err":""}`} type="time" value={oInfo.time} onChange={e=>setOInfo({...oInfo,time:e.target.value})} />{oErr.time&&<span className="err-m">{oErr.time}</span>}</div>
                  <div className="fg"><label className="flabel">Service Location *</label><input className={`finput ${oErr.location?"err":""}`} placeholder="Address or venue name" value={oInfo.location} onChange={e=>setOInfo({...oInfo,location:e.target.value})} />{oErr.location&&<span className="err-m">{oErr.location}</span>}</div>
                  <div className="fg"><label className="flabel">Est. Distance from Midland (miles)</label><input className="finput" type="number" min={0} placeholder="e.g. 12" value={oInfo.miles} onChange={e=>setOInfo({...oInfo,miles:e.target.value})} /></div>
                </div>
              </div>
            ) : oStep===2 ? (
              <>
                {oSvc==="buffet" && (
                  <div className="form-card" style={{marginBottom:12}}>
                    <div className="fc-t">Select Buffet Style</div>
                    <div className="sub-grid">
                      {BUFFET_SUBTYPES.map(b=>(
                        <div key={b.id} className={`sub-card ${oSub===b.id?"sel":""}`} onClick={()=>setOSub(b.id)}>
                          <div className="sub-icon">{b.emoji}</div>
                          <div className="sub-lbl">{b.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="svc-grid">
                  {SERVICES_INFO.map(s=>{
                    const fails = validateSvc(s, oInfo);
                    const isSel = oSvc===s.id;
                    return (
                      <div key={s.id} className={`svc-card ${isSel?"sel":""}`}
                        onClick={()=>{ if(fails.length) return; setOSvc(s.id); if(s.id!=="buffet") setOSub(null); }}>
                        {isSel&&<div className="svc-chk">✓</div>}
                        <div className="svc-icon">{s.icon}</div>
                        <div className="svc-tag-s">{s.tag}</div>
                        <div className="svc-name">{s.label}</div>
                        <div className="svc-desc">{s.desc}</div>
                        {fails.length>0&&(
                          <>
                            <div className="svc-fail">{fails.map((f,i)=><div key={i}>⚠ {f}</div>)}</div>
                            <button className="wa-btn" onClick={e=>{e.stopPropagation();window.open(`https://wa.me/14325550100?text=${waMsg(oInfo.name,s.label,oInfo,fails)}`,'_blank');}}>
                              💬 Contact via WhatsApp
                            </button>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <>
                {oSvc==="pickup" && (
                  <>
                    <div className="tier-badge">Pick Up · The Cantinita · Same Day Available</div>
                    <MenuSec cat="plate" title="Select Your Plate" items={BOXLUNCH_PLATES} max={1} />
                  </>
                )}
                {oSvc==="boxlunch" && (
                  <>
                    <div className="tier-badge">Box Lunch · 1 Plate per Guest</div>
                    <MenuSec cat="plate" title="Select Plate" items={BOXLUNCH_PLATES} max={1} />
                  </>
                )}
                {oSvc==="coffee" && (() => {
                  const t = tier||{drinks:4,snacks:2};
                  return <>
                    <div className="tier-badge">{tier?.label||"Tier 1 · 10+ Guests"}</div>
                    <MenuSec cat="drinks"  title={`Beverages — pick ${t.drinks}`} items={COFFEE_MENU.drinks} max={t.drinks} />
                    <MenuSec cat="snacks"  title={`Savory Snacks — pick ${t.snacks}`} items={COFFEE_MENU.savory} max={t.snacks} />
                    <MenuSec cat="desserts" title="Sweet Snacks — pick 1" items={COFFEE_MENU.sweet} max={1} />
                    <MenuSec cat="sides"   title="Fresh Options — pick 1" items={COFFEE_MENU.fresh} max={1} />
                  </>;
                })()}
                {oSvc==="banquet" && menu && (() => {
                  const t = tier||{proteins:2,sides:3};
                  return <>
                    <div className="tier-badge">{tier?.label||"Tier 1 · 20+ Guests"}</div>
                    <MenuSec cat="proteins"  title={`Proteins — pick ${t.proteins}`} items={menu.proteins} max={t.proteins} />
                    <MenuSec cat="sides"     title={`Sides — pick ${t.sides}`} items={menu.sides} max={t.sides} />
                    <MenuSec cat="desserts"  title="Desserts — pick 1" items={menu.desserts} max={1} />
                    <MenuSec cat="complements" title="Complements" items={menu.complements} included />
                  </>;
                })()}
                {oSvc==="buffet" && menu && (() => {
                  const t = tier||{proteins:2,sides:3};
                  return <>
                    <div className="tier-badge">{tier?.label||"Tier 1 · 20+ Guests"} · {BUFFET_SUBTYPES.find(b=>b.id===oSub)?.label}</div>
                    <MenuSec cat="proteins"  title={`Proteins — pick ${t.proteins}`} items={menu.proteins} max={t.proteins} />
                    <MenuSec cat="sides"     title={`Sides — pick ${t.sides}`} items={menu.sides} max={t.sides} />
                    <MenuSec cat="desserts"  title="Desserts — pick 1" items={menu.desserts} max={1} />
                    <MenuSec cat="complements" title="Complements" items={menu.complements} included />
                  </>;
                })()}
                {oSvc==="foodtruck" && (
                  <div className="form-card" style={{textAlign:"center",padding:40}}>
                    <div style={{fontSize:"3rem",marginBottom:12}}>🚚</div>
                    <div style={{fontFamily:"'Playfair Display',serif",fontSize:"1.4rem",fontWeight:900,textTransform:"uppercase",marginBottom:8}}>Open Service</div>
                    <p style={{color:"var(--sl)",fontSize:".82rem",lineHeight:1.7,maxWidth:420,margin:"0 auto 16px"}}>The truck arrives at your event. Guests order directly at the window — full menu available throughout. <strong>Invoice issued post-event.</strong></p>
                    <div className="tier-badge" style={{display:"inline-flex"}}>Open Tab · Post-Event Invoice</div>
                  </div>
                )}
              </>
            )}
          </div>

          {!oDone && (
            <div className="bottom-bar">
              <div className="bb-sum">
                {oInfo.name&&<><strong>{oInfo.name}</strong> · </>}
                {oInfo.guests&&<><strong>{oInfo.guests} guests</strong> · </>}
                {selSvc&&<strong>{selSvc.label}{oSub?` · ${BUFFET_SUBTYPES.find(b=>b.id===oSub)?.label}`:""}</strong>}
              </div>
              <div className="bb-btns">
                {oStep>1&&<button className="btn-back" onClick={()=>setOStep(s=>s-1)}>← Back</button>}
                <button className="btn-next" onClick={goNext} disabled={oStep===2&&!step2Valid}>
                  {oStep===3||oSvc==="foodtruck" ? "★ Submit Order" : "Next →"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── REWARDS ── */}
      {page==="rewards" && (
        <div className="rewards-wrap">
          <div className="ph">
            <div className="ph-inner">
              <div className="ph-step">★ Loyalty Program</div>
              <h1>Lone<span>star</span> Rewards</h1>
              <span className="ph-script">earn points, earn perks</span>
              <p>★ 1 point earned per $1 spent · Redeem 100 pts = $10 off your next order</p>
            </div>
          </div>
          <div className="rewards-pg">
            {user ? (
              <div className="pts-hero">
                <div className="pts-num">{user.points.toLocaleString()}</div>
                <div className="pts-label">Points Balance</div>
                <span className="pts-script">{userTier?.name}</span>
                <div className="pts-redeem">
                  <button className="btn-p" onClick={()=>go("account")}>View History</button>
                  <button className="btn-o" onClick={()=>{ resetOrder(); go("order"); }}>Earn More Points</button>
                </div>
              </div>
            ) : (
              <div className="pts-hero">
                <div style={{fontSize:"2.8rem",marginBottom:8}}>⭐</div>
                <div className="pts-label" style={{marginBottom:12}}>Sign in to check your balance & redeem rewards</div>
                <button className="btn-p" onClick={()=>go("login")}>Sign In to Your Account</button>
              </div>
            )}

            <div className="sec-eye" style={{marginTop:28,marginBottom:12}}>Membership Tiers</div>
            <div className="tier-cards">
              {REWARDS_TIERS.map(t=>{
                const isActive = user && user.points>=t.min && (t.max===Infinity||user.points<t.max);
                return (
                  <div className="tier-card" key={t.name} style={{borderColor:t.color,background:`rgba(0,0,0,.02)`}} data-is-active={isActive}>
                    {isActive&&<div style={{position:"absolute",top:0,left:0,right:0,height:3,background:t.color}}/>}
                    <div className="tier-name" style={{color:t.color}}>{t.name}</div>
                    <div className="tier-range">{t.max===Infinity?`${t.min.toLocaleString()}+ pts`:`${t.min}–${t.max.toLocaleString()} pts`}</div>
                    {t.perks.map(p=><div className="tier-perk" key={p}>{p}</div>)}
                    {isActive&&<div style={{marginTop:10,fontSize:".6rem",fontWeight:700,color:t.color,letterSpacing:".08em"}}>✓ YOUR CURRENT TIER</div>}
                  </div>
                );
              })}
            </div>

            <div className="sec-eye" style={{marginTop:24,marginBottom:12}}>Redeem Your Points</div>
            {[
              { label:"$10 Off Your Order",     cost:100, desc:"Applied as a discount on your next catering order." },
              { label:"$25 Off Your Order",     cost:250, desc:"Great for medium-sized events. Applied at checkout." },
              { label:"Free Dessert Upgrade",   cost:150, desc:"Upgrade your dessert selection at no charge." },
              { label:"$50 Off Your Order",     cost:500, desc:"Our biggest discount — perfect for large events." },
              { label:"Complimentary Tasting",  cost:300, desc:"Schedule a private tasting session at The Cantinita." },
            ].map(r=>(
              <div className="redeem-card" key={r.label}>
                <div className="rc-head"><span className="rc-t">{r.label}</span><span className="rc-cost">{r.cost} pts</span></div>
                <div className="rc-desc">{r.desc}</div>
                <button className="btn-redeem" disabled={!user||user.points<r.cost}
                  onClick={()=>doRedeem(r.cost, r.label)}>
                  {!user?"Sign In to Redeem":user.points<r.cost?"Not Enough Points":"Redeem Now"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── LOGIN ── */}
      {page==="login" && (
        <div className="login-wrap">
          <div className="login-box">
            <h2>Welcome <span style={{color:"var(--org)"}}>Back</span></h2>
            <span className="login-script">sign in to your account</span>
            <div className="login-form">
              <input className="login-input" placeholder="Email address" value={loginEmail} onChange={e=>setLoginEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doLogin()} />
              <input className="login-input" type="password" placeholder="Password" value={loginPw} onChange={e=>setLoginPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doLogin()} />
              {loginErr&&<div className="login-err">{loginErr}</div>}
              <button className="btn-login" onClick={doLogin}>★ Sign In</button>
            </div>
            <div className="login-hint">
              Demo accounts:<br/>
              jane@example.com / lonestar1<br/>
              demo@cantinita.com / demo
            </div>
          </div>
        </div>
      )}

      {/* ── ACCOUNT ── */}
      {page==="account" && (
        <div className="acct-wrap">
          <div className="ph">
            <div className="ph-inner">
              <div className="ph-step">★ My Account</div>
              <h1>My <span>Profile</span></h1>
            </div>
          </div>
          {!user ? (
            <div style={{textAlign:"center",padding:"60px 20px"}}>
              <p style={{marginBottom:16,color:"var(--sl)"}}>Please sign in to view your account.</p>
              <button className="btn-p" onClick={()=>go("login")}>Sign In</button>
            </div>
          ) : (
            <div className="acct-pg">
              <div className="acct-grid">
                {/* SIDEBAR */}
                <div className="acct-side">
                  <div className="acct-card">
                    <div className="acct-avatar">🤠</div>
                    <div className="acct-name">{user.name}</div>
                    <div className="acct-email">{user.email}</div>
                    <div className="acct-pts">⭐ {user.points.toLocaleString()} Points</div>
                    {userTier&&<div className="acct-tier-badge" style={{background:userTier.color}}>{userTier.name}</div>}
                  </div>
                  <div className="acct-card" style={{padding:"10px 0"}}>
                    <div className="acct-nav">
                      {[["orders","📋 Order History"],["rewards","⭐ My Rewards"],["profile","👤 Profile Info"]].map(([id,lbl])=>(
                        <button key={id} className={`an-btn ${acctTab===id?"act":""}`} onClick={()=>setAcctTab(id)}>{lbl}</button>
                      ))}
                    </div>
                  </div>
                  <button className="logout-btn" onClick={()=>{ setUser(null); go("home"); showToast("Signed out. See you soon! 👋"); }}>Sign Out</button>
                </div>

                {/* MAIN */}
                <div>
                  {acctTab==="orders" && (
                    <>
                      <div className="sec-eye" style={{marginBottom:12}}>Order History</div>
                      {user.orders.length===0 ? (
                        <div className="form-card" style={{textAlign:"center",padding:36,color:"var(--sl)"}}>No orders yet. <button className="btn-p" style={{marginTop:12}} onClick={()=>{ resetOrder(); go("order"); }}>Place Your First Order</button></div>
                      ) : user.orders.map(o=>(
                        <div className="order-row" key={o.id}>
                          <div>
                            <div className="or-id">{o.id}</div>
                            <div className="or-svc">{o.service}</div>
                            <div className="or-date">{o.date} · {o.guests} guests</div>
                          </div>
                          <div style={{textAlign:"right"}}>
                            <div className="or-total">${o.total.toLocaleString()}</div>
                            <div className="or-pts">+{o.pts.toLocaleString()} pts</div>
                            <div className={`or-status ${o.status==="Completed"?"comp":"upco"}`}>{o.status}</div>
                          </div>
                        </div>
                      ))}
                      <button className="btn-p" style={{marginTop:14}} onClick={()=>{ resetOrder(); go("order"); }}>+ New Order</button>
                    </>
                  )}
                  {acctTab==="rewards" && (
                    <>
                      <div className="sec-eye" style={{marginBottom:12}}>My Rewards</div>
                      <div style={{background:"var(--blk)",border:"2px solid var(--org)",padding:24,textAlign:"center",marginBottom:16}}>
                        <div style={{fontFamily:"'Playfair Display',serif",fontSize:"3rem",fontWeight:900,color:"var(--tan)"}}>{user.points.toLocaleString()}</div>
                        <div style={{fontSize:".6rem",fontWeight:700,letterSpacing:".14em",textTransform:"uppercase",color:"rgba(255,255,255,.35)"}}>Available Points</div>
                        {userTier&&<div style={{marginTop:8,fontSize:".68rem",fontWeight:700,color:userTier.color}}>★ {userTier.name}</div>}
                        <div style={{marginTop:4,fontSize:".66rem",color:"rgba(255,255,255,.28)"}}>100 pts = $10 off · 1 pt per $1 spent</div>
                      </div>
                      {[
                        { label:"$10 Off",cost:100 },{ label:"$25 Off",cost:250 },{ label:"Free Dessert Upgrade",cost:150 },
                        { label:"$50 Off",cost:500 },{ label:"Complimentary Tasting",cost:300 },
                      ].map(r=>(
                        <div className="redeem-card" key={r.label}>
                          <div className="rc-head"><span className="rc-t">{r.label}</span><span className="rc-cost">{r.cost} pts</span></div>
                          <button className="btn-redeem" disabled={user.points<r.cost} onClick={()=>doRedeem(r.cost, r.label)}>
                            {user.points<r.cost?"Not Enough Points":"Redeem"}
                          </button>
                        </div>
                      ))}
                    </>
                  )}
                  {acctTab==="profile" && (
                    <>
                      <div className="sec-eye" style={{marginBottom:12}}>Profile Information</div>
                      <div className="form-card">
                        <div className="form-grid">
                          <div className="fg"><label className="flabel">Full Name</label><input className="finput" defaultValue={user.name} /></div>
                          <div className="fg"><label className="flabel">Email</label><input className="finput" defaultValue={user.email} /></div>
                          <div className="fg"><label className="flabel">Phone</label><input className="finput" defaultValue={user.phone} /></div>
                          <div className="fg"><label className="flabel">City</label><input className="finput" defaultValue="Midland, TX" /></div>
                        </div>
                        <button className="btn-p" style={{marginTop:14}} onClick={()=>showToast("Profile saved! ✓")}>Save Changes</button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}  