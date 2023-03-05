#! /usr/bin/env node

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const async = require('async')
const Item = require('./models/ItemModel')
const Category = require('./models/CategoryModel')


const mongoose = require('mongoose');
mongoose.set('strictQuery', false); // Prepare for Mongoose 7

const mongoDB = userArgs[0];

main().catch(err => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

const items = []
const categories = []

function categoryCreate(name, description, cb) {
  const category = new Category({ name: name, description: description });
       
  category.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Category: ' + category);
    categories.push(category)
    cb(null, category);
  }   );
}

function itemCreate(name, category, description, price, stock, cb) {
  itemdetail = { 
    name: name,
    category: category,
    description: description,
    price: price,
    stock: stock,
  }

  if (category != false) itemdetail.category = category;
    
  const item = new Item(itemdetail);    
  item.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Item: ' + item);
    items.push(item)
    cb(null, item)
  }  );
}



function createCategories(cb) {
    async.series([
        function(callback) {
          categoryCreate('Adventure', 'Styled to look as though they could head to Kathmandu without bothering with roads, these are biking’s equivalent of the Range Rover. But here’s the irony: they’re fantastic road bikes, but are actually pretty frightening off road because they’re so heavy. Most owners wisely never venture onto dirt and instead enjoy the comfy riding position, superb weather protection and supple suspension on tarmac.', callback);
        },
        function(callback) {
          categoryCreate('Cruiser', 'If you can picture a Harley-Davidson, you know what a cruiser is – long, low and with a relaxed V-twin engine (ie it’s got two cylinders arranged in a V). Though they can thunder away from traffic lights faster than almost any sportscar, cruisers are not about outright performance. Instead, they’re designed to look cool while chugging lazily along', callback);
        },
        function(callback) {
          categoryCreate('Naked', 'The descendants of proper motorbikes like your grandad rode – no fancy fairings, just two wheels and an engine. You sit relatively upright, so they’re comfortable, but are designed to be agile too – very different to a cruiser. They’re fun to hustle round bends. Some are absurdly fast, essentially full-bore sportsbikes without the fairings, but most are fantastic beginner and intermediate bikes.', callback);
        },
        function(callback) {
          categoryCreate('Sport', 'These are known as race replicas for good reason – they’re road-going versions of race bikes, complete with full fairings, firm suspension and highly tuned engines. The upside of all this is their performance in perfect conditions: it’s stupendous. No bike is faster round a racetrack. The downside is their riding position, which puts lots of weight on your wrists and cramps your legs – not great for long journeys or pootling round town. Though most big manufacturers have a sportsbike as their flagship, there are plenty of beginner-friendly smaller-capacity versions.', callback);
        },
        function(callback) {
          categoryCreate('Scooter', 'At last, an easy one – scooters haven’t changed much since the 1947 Vespa. If it’s got small wheels, a floorboard for your feet and an automatic gearbox, it’s a scooter. They’re great city transport, with decent weather protection, loads of storage under the saddle and no gears or clutch to worry about – you just twist and go. Several manufacturers sell bigger versions – maxi scooters – that can hit far higher speeds and handle motorway travel.', callback);
        },
        function(callback) {
          categoryCreate('Tourer', 'Big, sumptuous and covered in luggage; if you want to rack up big miles on holiday with a passenger, you need a tourer. Well, that’s not quite true because lots of bikes can tour, but a tourer makes it so damn easy. A good tourer will make cruising all day at 85mph feel utterly effortless (cruisers, on the other hand, don’t like that at all – they’re happier at 60), and they usually have all the latest gizmos such as stereos, heated seats and central locking for the luggage. They are, unsurprisingly, expensive.', callback);
        },
        ],
        // optional callback
        cb);
}


function createItems(cb) {
    async.parallel([
        function(callback) {
          itemCreate("Honda PCX125", categories[4], 'When the Honda PCX125, a sub-£3k 125cc scooter hit the top spot in the UK sales charts, it dominated for years not just weeks and it’s easy to see why; low cost, easy commuting is the name of the game with scooters and mopeds and when you’ve got a sporty and stylish little number like the PCX125 with a Honda badge and the accompanying build quality all for a decent price then the maths all add up to a best seller. Everything Honda did, they did it for the commuter. Not quite as catchy.', '£2929', '9', callback);
        },
        function(callback) {
          itemCreate("Honda CBR1000RR-R Fireblade", categories[3], 'Honda have opened a brilliant new chapter in its Fireblade history. This CBR-1000RR-R SP is an overwhelming success and should make for some interesting head-to-head tests alongside the Ducati Panigale V4S and BMW’s S1000RR. Throw in the R1M and RSV4 1100 Factory too and, despite the lowly sales figures for such machines, we are blessed to be in a golden era of outrageous sports bikes.', '£19,999', '25', callback);
        },
        function(callback) {
          itemCreate("Yamaha MT-07", categories[2], 'Yamaha’s MT-07 has been a resounding smash-hit, so much so in fact that it is not only one of Europe’s best selling bikes, it is also Yamaha’s best selling motorcycle and has cleared 80,000 units so far in its five year life. Considering that when it was launched in 2014 everyone assumed it was just some run-of-the-mill parallel twin commuter, that’s an outstanding achievement. But of course the fact of the matter is that the MT-07 is far from run-of-the-mill…', '£5,200', '18', callback);
        },
        function(callback) {
          itemCreate("Harley-Davidson Fat Boy 114", categories[1], "In 1989, Harley-Davidson took a prototype custom bike to Daytona Bike Week. A pumped up soft-tail with solid wheels, wide bars, a shotgun exhaust and finished in matte grey, the bike was reputed to be styled on the B-29 bomber (used to deliver the 'Fat Man' A-Bomb on Hiroshima) and was fittingly given then title of 'Fat Boy'. Others argued that it took its styling cues from a steamroller, echoed in its wide track and exaggerated tyres. While the inspiration was unclear, what was immediately obvious was that Harley-Davidson had created a new style of bike and that people wanted a piece of the action.", '£20,225', '4', callback);
        },
        function(callback) {
          itemCreate("BMW R1250GS Adventure", [categories[0], categories[5]], "BMW’s big boxer news for 2019 is the introduction of its new ‘ShiftCam’ engine across the ‘R’ model range – the base R1250GS, the R1250RT tourer, R1250R, R1250RS and, here, the larger tanked, longer-suspended GSA – the Adventure variant.", '£14,415', '15', callback);
        },
        ],
        // optional callback
        cb);
}

async.series([
    createCategories,
    createItems,
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('Items: '+ items);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});


