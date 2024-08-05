import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port=3005;
app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req,res)=> {
    res.render("index.ejs");
})
// let ingredients =[];
app.post("/random-drink", async(req,res)=> {
   try {
    const result = await axios.get("https://www.thecocktaildb.com/api/json/v1/1/random.php");
    const drink = result.data.drinks[0]; // Access the first element of the drinks array

    let drink_name = drink.strDrink;
    let alcoholic_type = drink.strAlcoholic;
    let drink_image = drink.strDrinkThumb;
    let drink_main_ingredients = drink.strIngredient1;
    let ingredients =[];
    let measurments =[];
    let ingredients_measurments =[]
    

    for(let i=1 ; i<=15;i++){
        const ingredient = drink[`strIngredient${i}`];
        // let sendIngredient = drink.ingredient;
        const measurment = drink[`strMeasure${i}`];

        if(ingredient !== null && measurment !== null){
            ingredients_measurments.push({ ingredient,measurment})
        }
        
    }

    res.render("index.ejs", { 
        image: drink_image,
        drinkName: drink_name,
        alcaholicType: alcoholic_type,
        ingredients_measurments: ingredients_measurments,
    });
   } catch (error) {
    console.error("Failed to make request:", error.message);
    res.sendStatus(404);
} 
    
})

app.post("/search-drink" ,async(req,res)=>{
    try {
        const userSearch = req.body.search || 'margarita'; // Use user input or default to "margarita"
        console.log('User search:', userSearch);
        
        const result = await axios.get(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${userSearch}`);
        console.log('API result:', result.data);

        const drinksList = result.data.drinks || []; // Ensure drinksList is an array even if no drinks are found
        
    
            drinksList.forEach(drink => {
                let ingredients_measurments =[];
                for(let i=1 ; i<=15;i++){
                    const ingredient = drink[`strIngredient${i}`];
                    // let sendIngredient = drink.ingredient;
                    const measurment = drink[`strMeasure${i}`];
                    
                    if(ingredient !== null && measurment !== null){
                        ingredients_measurments.push({ ingredient, measurment});
                       
                    }
                    drink.ingredients = ingredients_measurments;
                }
            });
            // drinksList.push(ingredients_measurments);
                res.render('index.ejs', { drinksList, });
            } catch (error) {
    console.error("Failed to make request:", error.message);
    res.sendStatus(404);
   } 
});
app.listen(port,() => {
    console.log(`listening on server ${port}`)
})