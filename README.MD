# FlavourFlow - Card comparison

## The task 

Create a Tinderesque interface. Instead of swiping one card from the deck to left and right, the users should choose between two cards based on their preferences and through click actions the cards should animate to up and down.  

For the task I followed the instructions and what is common sense.  
For instance, I did not see the point comparing 2 different attributes:

<span style="color: red;">"Traditional breakfast"</span> Vs. <span style="color: green;">"Quick and easy"</span>

Instead my changes compare 2 cards if they belong to the same group:   

<span style="color: blue;">"Sweet" Vs. "Savory"</span>  

## My future development idea was:  
If the user clicked on all the attributes then a second round filtering would start with categories.
That is why I extended the FlavourFlow data with categories.  

### An example of the flow could be:  

1. Round (Attributes):  
- User chooses <span style="color: green;">"Requires more time"</span> over <span style="color: red;">"Quick and easy"</span> from  <span style="color: blue;">"Preparation time"</span> category.  
- User chooses "Premium Ingredients" over "Affordable Ingredients" from "Cost" category.  

2. Round (No more attributes, just categories):  
- User chooses "Preparation Time" over "Cost", because he likes spending time in his kitchen, and is more important for him than the price of the ingredients.

## My changes mainly connected to these files: 

### Pages:
[FlavourFlowPage](ff.web/src/components/pages/FlavourFlowPage.tsx)  
[FlavourFlowResultPage](ff.web/src/components/pages/FlavourFlowResultPage.tsx)  

### Context:
[FlavourFlowContext](ff.web/src/context/FlavourFlowContext.tsx)  

### Components:
[ChoiceUI](ff.web/src/components/organisms/ChoiceUI.tsx)  
[Card](ff.web/src/components/atoms/Card.tsx)  

### SCSS modules:
[FlavourFlow](ff.web/src/scss/components/pages/FlavourFlow.module.scss)  
[ChoiceUI](ff.web/src/scss/components/organisms/ChoiceUI.module.scss)  

### Data:
[FlavourFlowData](ff.web/src/utils/FlavourFlowData.ts)  

### Functions
[FlavourFlowFunctions](ff.web/src/utils/FlavourFlowFunctions.ts)  

## For further details see the commit history:
[Commit History](https://github.com/lilla-nemeth/card-sorting-task/commits/main/?author=lilla-nemeth&before=e7ad6696bc00db884421cbcfb26b3e6879576109+35)  


## To run frontend part:

1. Go to the ff.web folder and

- run `npm run dev`

or

- Use the Dockerfile
