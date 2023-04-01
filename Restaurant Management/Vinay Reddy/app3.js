function filterTables() {
    var input, filter, tableCards, tableCard, i, txtValue;
    input = document.getElementById("table-search");
    filter = input.value.toUpperCase();
    tableCards = document.getElementsByClassName("table-card");
    for (i = 0; i < tableCards.length; i++) {
      tableCard = tableCards[i];
      txtValue = tableCard.textContent || tableCard.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tableCard.classList.remove("hide");
        tableCard.classList.add("show");
      } else {
        tableCard.classList.remove("show");
        tableCard.classList.add("hide");
      }
    }
}
function filterMenu() {
    // Get the input value and convert to lowercase
    const input = document.getElementById("menu-search");
    const filter = input.value.toLowerCase();
    // Get all the menu cards
    const menuCards = document.querySelectorAll(".menu-card");
    // Loop through the menu cards and hide/show them based on the filter
    menuCards.forEach(card => {
      const item = card.getElementsByTagName("h2")[0].innerText.toLowerCase();
      const type = card.getElementsByTagName("span")[1].innerText.toLowerCase();
      if (item.indexOf(filter) > -1 || type.indexOf(filter) > -1) {
        card.style.display = "";
      } else {
        card.style.display = "none";
      }
    });
}


const menuCards = document.querySelectorAll('.menu-card');
const tableCards = document.querySelectorAll('.table-card');
let draggableItem = null;
//->
let selectedTableCard=null;

// Add dragstart event listener to menu cards
menuCards.forEach((card) => {
  card.addEventListener('dragstart', dragStart);
});

// Add dragover event listener to table cards
tableCards.forEach((card) => {
  card.addEventListener('dragover', dragOver);
  card.addEventListener('dragenter', dragEnter);
  card.addEventListener('dragleave', dragLeave);
  card.addEventListener('drop', drop);
  card.addEventListener('click',openTablePopup);
  
});

// Drag functions
function dragStart() {
  draggableItem = this;
}

function dragOver(e) {
  e.preventDefault();
}

function dragEnter(e) {
  e.preventDefault();
  this.classList.add('hovered');
}

function dragLeave() {
  this.classList.remove('hovered');
}

function drop() {
    selectedTableCard = this;
  
    // Get attr-key of menu card and table card
    const menuCardAttrKey = draggableItem.getAttribute('attr-key');
    const tableCardAttrKey = this.getAttribute('attr-key');

    // Get total-cost and total-items elements for the table
    const totalCostEl = document.querySelector(`.table-card[attr-key="${tableCardAttrKey}"] #total-cost`);
    const totalItemsEl = document.querySelector(`.table-card[attr-key="${tableCardAttrKey}"] #total-items`);
  
    // Get the array of ordered items for the table
    let orderedItems = JSON.parse(localStorage.getItem(`orderedItems-${tableCardAttrKey}`)) || [];
  
    const itemName = draggableItem.querySelector('h2').innerText;
    const itemCost = parseInt(draggableItem.dataset.itemCost);
  
    // Check if the item already exists in the ordered items array
    let itemIndex = orderedItems.findIndex((item) => item.name === itemName);
  
    if (itemIndex === -1) {
      // If the item does not exist, add it to the ordered items array
      orderedItems.push({ name: itemName, quantity: 1, cost: itemCost });
    } else {
      // If the item exists, update its quantity and cost
      orderedItems[itemIndex].quantity += 1;
      orderedItems[itemIndex].cost += itemCost;
    }
  
    // Update total cost and total items in table
    let totalCost = parseInt(totalCostEl.innerText);
    let totalItems = parseInt(totalItemsEl.innerText);
    totalCost += itemCost;
    totalItems += 1;
    totalCostEl.innerText = totalCost;
    totalItemsEl.innerText = totalItems;
  
    // Save the ordered items array to local storage
    localStorage.setItem(`orderedItems-${tableCardAttrKey}`, JSON.stringify(orderedItems));
  
    // Reset draggableItem to null
    draggableItem = null;
}
for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const value = localStorage.getItem(key);
    console.log(`${key}: ${value}`);
}
window.onbeforeunload = function() {
    localStorage.clear();
}


function openTablePopup() {
  const tableCardAttrKey = this.getAttribute('attr-key');
  const orderedItems = JSON.parse(localStorage.getItem(`orderedItems-${tableCardAttrKey}`)) || [];

  // Create a new popup window
  let popup = window.open("", "Table Popup", "width=400, height=400,top="+(screen.height/2-200)+ ",left="+(screen.width/2-200));

  // Add table number to popup
  const tableNumberEl = document.createElement("h2");
  tableNumberEl.innerText = `Table ${parseInt(tableCardAttrKey) + 1}`;
  popup.document.body.appendChild(tableNumberEl);
  popup.document.body.style.padding = "20px";
  popup.document.body.style.fontFamily = "Arial, sans-serif";
  popup.document.body.style.fontSize = "16px";
  popup.document.body.style.lineHeight = "1.5";
  popup.document.body.style.background = "white";
  popup.document.body.style.maxWidth = "400px";
  popup.document.body.style.margin = "0 auto";
  popup.document.body.style.border = "1px solid black";
  popup.document.body.style.borderRadius = "10px";
  popup.document.body.style.boxShadow = "2px 2px 10px rgba(0, 0, 0, 0.5)";
  popup.document.title = "Order Details";

  // const rowname = document.createElement("h2");
  // rowname.innerHTML= 

  // Add ordered items list to popup
  const itemsListEl = document.createElement("ul");
  itemsListEl.style.marginBottom="10px"; //add margin to the bottom of list
  itemsListEl.style.display="flex"; //
  itemsListEl.style.flexDirection="column"; //
  popup.document.body.appendChild(itemsListEl );

  // Add item details to items list
  orderedItems.forEach((item) => {
    const itemEl = document.createElement("li");
    itemEl.style.display="flex"; //set the flex display
    itemEl.style.justifyContent= "space-between"; //align items to start and end of container
    itemEl.style.flexDirection="row";
    itemEl.style.marginBottom="5px"; //add margin to the bottom of each item
    itemsListEl.appendChild( itemEl);

    // Add item name to item details
    const itemNameEl = document.createElement("span");
    itemNameEl.innerText = item.name;
    itemNameEl.style.color="Red";
    itemEl.appendChild(itemNameEl);

    //add space between item name and quantity
    const spaceEl=document.createElement("span");
    spaceEl.innerText="";
    itemEl.appendChild(spaceEl);

    // Add item quantity to item details
    const itemQuantityEl = document.createElement("span");
    itemQuantityEl.innerText = `x  ${item.quantity}`;
    itemQuantityEl.style.marginRight="10px";
    itemEl.appendChild(itemQuantityEl);


    //add space between quantity and price
    const spaceEl2=document.createElement("span");
    spaceEl2.innerText="";
    itemEl.appendChild(spaceEl2);

    // Add item cost to item details
    const itemCostEl = document.createElement("span");
    const itemCost = item.cost / item.quantity;
    itemCostEl.innerText = `Rs${item.cost}`;
    itemEl.appendChild(itemCostEl);

  //add space between price and buttons
  const spaceEl3=document.createElement("span");
  spaceEl3.innerText="";
  itemEl.appendChild(spaceEl3);

        // Add increase button to item details
        const increaseBtn = document.createElement("button");
         increaseBtn.innerText = "+";
         //increaseBtn.style.display="block"; //set the block display
         increaseBtn.addEventListener("click", () => {
         item.quantity += 1;
         item.cost += itemCost;
         itemQuantityEl.innerText = `    x      ${item.quantity}`;
         itemCostEl.innerText = `      Rs${item.cost}`;
          totalCostEl.innerText = ` ${totalCost += itemCost}`;

          const orderedItemsKey = `orderedItems-${tableCardAttrKey}`;


           // Retrieve the current ordered items array from local storage
  const orderedItemsString = localStorage.getItem(orderedItemsKey);
  let orderedItems = [];
  if (orderedItemsString) {
    orderedItems = JSON.parse(orderedItemsString);
  }

  // Update the quantity and cost of the item that was just increased
  const updatedItem = orderedItems.find((i) => i.name === item.name);
  updatedItem.quantity = item.quantity;
  updatedItem.cost = item.cost;

  // Store the updated ordered items array back into local storage
  localStorage.setItem(orderedItemsKey, JSON.stringify(orderedItems));

          totalItems = orderedItems.reduce((acc, item) => acc + item.quantity, 0);
         totalItemsEl.innerText = `${totalItems} items`;

         var a=document.querySelector(`.table-card[attr-key="${tableCardAttrKey}"] #total-cost`);
          a.innerHTML= totalCostEl.innerText;

        var b=document.querySelector(`.table-card[attr-key="${tableCardAttrKey}"] #total-items`);
         b.innerHTML= `${totalItems}`;

          

          });
          increaseBtn.style.color="blue";
          increaseBtn.style.display="block";
          itemEl.appendChild(increaseBtn);


        const spaceEl4=document.createElement("span");
        spaceEl4.innerText="";
        itemEl.appendChild(spaceEl4);

        // Add decrease button to item details
         const decreaseBtn = document.createElement("button");
         decreaseBtn.innerText = "--";
         decreaseBtn.addEventListener("click", () => {
          if (item.quantity > 1) {
          item.quantity -= 1;
          item.cost -= itemCost;
          itemQuantityEl.innerText = `      x      ${item.quantity}`;
          itemCostEl.innerText = `       Rs${item.cost}`;
          totalCostEl.innerText = `      ${totalCost -= itemCost}`;

          
    // Retrieve the current ordered items array from local storage
    const orderedItemsString = localStorage.getItem(`orderedItems-${tableCardAttrKey}`);
    let orderedItems = [];
    if (orderedItemsString) {
      orderedItems = JSON.parse(orderedItemsString);
    }

    // Update the quantity and cost of the item that was just decreased
    const updatedItem = orderedItems.find((i) => i.name === item.name);
    updatedItem.quantity = item.quantity;
    updatedItem.cost = item.cost;

    // Store the updated ordered items array back into local storage
    localStorage.setItem(`orderedItems-${tableCardAttrKey}`, JSON.stringify(orderedItems));
  
          totalItems = orderedItems.reduce((acc, item) => acc + item.quantity, 0);
          totalItemsEl.innerText = `${totalItems} items`;
          }
          var a=document.querySelector(`.table-card[attr-key="${tableCardAttrKey}"] #total-cost`);
          a.innerHTML= totalCostEl.innerText;

        var b=document.querySelector(`.table-card[attr-key="${tableCardAttrKey}"] #total-items`);
         b.innerHTML= totalItems;

          });
          decreaseBtn.style.color="green";
          decreaseBtn.style.display="block";
         itemEl.appendChild(decreaseBtn);


         const spaceEl5=document.createElement("span");
         spaceEl5.innerText="";
         itemEl.appendChild(spaceEl5);

    // Add delete button to item details
    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "X";
    deleteBtn.addEventListener("click", () => {
      itemEl.remove();
      const index = orderedItems.indexOf(item);
      orderedItems.splice(index, 1);
      localStorage.setItem(`orderedItems-${tableCardAttrKey}`, JSON.stringify(orderedItems));
      totalCostEl.innerText = `${totalCost -= item.cost}`;
      totalItemsEl.innerText = `${totalItems -= item.quantity} items`;

      var a=document.querySelector(`.table-card[attr-key="${tableCardAttrKey}"] #total-cost`);
          a.innerHTML= totalCostEl.innerText;

        var b=document.querySelector(`.table-card[attr-key="${tableCardAttrKey}"] #total-items`);
         b.innerHTML= totalItems;

      
    });
    deleteBtn.style.color="red";
    deleteBtn.style.display="block";
    itemEl.appendChild(deleteBtn);
  });


   // Add total cost to popup
   let totalCost = orderedItems.reduce((acc, item) => acc + item.cost, 0);
   const totalCostEl = document.createElement("p");
   totalCostEl.innerText = `Rs${totalCost}`;
   popup.document.body.appendChild(totalCostEl);

   //  Add total items to popup
   let totalItems = orderedItems.reduce((acc, item) => acc + item.quantity, 0);
   const totalItemsEl = document.createElement("p");
   totalItemsEl.innerText = `${totalItems} items`;
   popup.document.body.appendChild(totalItemsEl);



      const clearAllOrders = (tableCardAttrKey) => {
          
      const tableCard = document.querySelector(`.table-card[attr-key="${tableCardAttrKey}"]`);
        
      const totalCostEl = tableCard.querySelector('#total-cost');
      const totalItemsEl = tableCard.querySelector('#total-items');
      const orderedItems = JSON.parse(localStorage.getItem(`orderedItems-${tableCardAttrKey}`)) || [];
      orderedItems.splice(0, orderedItems.length);
      localStorage.removeItem(`orderedItems-${tableCardAttrKey}`);
      popup.close();
      //location.reload();
      
      // Check if tableCard is not null before using it
      if (tableCard) {
         //tableCard.click(); // re-trigger the click event to reset the table card
        totalCostEl.innerText = "0";
        totalItemsEl.innerText = "0";
      }
      };
    
    const clearAllBtn = document.createElement("button");
    clearAllBtn.innerText = "Close Session(Generate Bill)";
    clearAllBtn.addEventListener("click", () => {
      alert(`Total cost: Rs${totalCost}\nThank you for your order!`);
      clearAllOrders(tableCardAttrKey);
    });
    popup.document.body.appendChild(clearAllBtn);
    
    // Attach event listener to each table card
    tableCards.forEach((tableCard) => {
    tableCard.addEventListener("click", openTablePopup);
});
}















































































// function openTablePopup() {
//     const tableCardAttrKey = this.getAttribute('attr-key');
//     const orderedItems = JSON.parse(localStorage.getItem(`orderedItems-${tableCardAttrKey}`)) || [];
  
//     // Create a new popup window
//     let popup = window.open("", "Table Popup", "width=400, height=400,top="+(screen.height/2-200)+ ",left="+(screen.width/2-200));
  
//     // Add table number to popup
//     const tableNumberEl = document.createElement("h2");
//     tableNumberEl.innerText = `Table ${parseInt(tableCardAttrKey) + 1}`;
//     popup.document.body.appendChild(tableNumberEl);
//     popup.document.body.style.padding = "20px";
//     popup.document.body.style.fontFamily = "Arial, sans-serif";
//     popup.document.body.style.fontSize = "16px";
//     popup.document.body.style.lineHeight = "1.5";
//     popup.document.body.style.background = "white";
//     popup.document.body.style.maxWidth = "400px";
//     popup.document.body.style.margin = "0 auto";
//     popup.document.body.style.border = "1px solid black";
//     popup.document.body.style.borderRadius = "10px";
//     popup.document.body.style.boxShadow = "2px 2px 10px rgba(0, 0, 0, 0.5)";
//     popup.document.title = "Order Details";
  
//     // Add ordered items list to popup
//     const itemsListEl = document.createElement("ul");
//     itemsListEl.style.marginBottom="10px"; //add margin to the bottom of list
//     itemsListEl.style.display="flex"; //
//     itemsListEl.style.flexDirection="column"; //
//     popup.document.body.appendChild(itemsListEl );
  
//     // Add item details to items list
//     orderedItems.forEach((item) => {
//       const itemEl = document.createElement("li");
//       itemEl.style.display="flex"; //set the flex display
//       itemEl.style.justifyContent= "space-between"; //align items to start and end of container
//       itemEl.style.flexDirection="row";
//       itemEl.style.marginBottom="5px"; //add margin to the bottom of each item
//       itemsListEl.appendChild( itemEl);
  
//       // Add item name to item details
//       const itemNameEl = document.createElement("span");
//       itemNameEl.innerText = item.name;
//       itemNameEl.style.color="Red";
//       itemEl.appendChild(itemNameEl);

//       //add space between item name and quantity
//       const spaceEl=document.createElement("span");
//       spaceEl.innerText="";
//       itemEl.appendChild(spaceEl);
  
//       // Add item quantity to item details
//       const itemQuantityEl = document.createElement("span");
//       itemQuantityEl.innerText = `x  ${item.quantity}`;
//       itemQuantityEl.style.marginRight="10px";
//       itemEl.appendChild(itemQuantityEl);


//       //add space between quantity and price
//       const spaceEl2=document.createElement("span");
//       spaceEl2.innerText="";
//       itemEl.appendChild(spaceEl2);
  
//       // Add item cost to item details
//       const itemCostEl = document.createElement("span");
//       const itemCost = item.cost / item.quantity;
//       itemCostEl.innerText = `Rs${item.cost}`;
//       itemEl.appendChild(itemCostEl);

//     //add space between price and buttons
//     const spaceEl3=document.createElement("span");
//     spaceEl3.innerText="";
//     itemEl.appendChild(spaceEl3);

//           // Add increase button to item details
//           const increaseBtn = document.createElement("button");
//            increaseBtn.innerText = "+";
//            //increaseBtn.style.display="block"; //set the block display
//            increaseBtn.addEventListener("click", () => {
//            item.quantity += 1;
//            item.cost += itemCost;
//            itemQuantityEl.innerText = `    x      ${item.quantity}`;
//            itemCostEl.innerText = `      Rs${item.cost}`;
//             totalCostEl.innerText = `     Rs${totalCost += itemCost}`;
  
//             totalItems = orderedItems.reduce((acc, item) => acc + item.quantity, 0);
//            totalItemsEl.innerText = `${totalItems} items`;
//             });
//             increaseBtn.style.color="blue";
//             increaseBtn.style.display="block";
//             itemEl.appendChild(increaseBtn);


//           const spaceEl4=document.createElement("span");
//           spaceEl4.innerText="";
//           itemEl.appendChild(spaceEl4);

//           // Add decrease button to item details
//            const decreaseBtn = document.createElement("button");
//            decreaseBtn.innerText = "--";
//            decreaseBtn.addEventListener("click", () => {
//             if (item.quantity > 1) {
//             item.quantity -= 1;
//             item.cost -= itemCost;
//             itemQuantityEl.innerText = `      x      ${item.quantity}`;
//             itemCostEl.innerText = `       Rs${item.cost}`;
//             totalCostEl.innerText = `      Rs${totalCost -= itemCost}`;
    
//             totalItems = orderedItems.reduce((acc, item) => acc + item.quantity, 0);
//             totalItemsEl.innerText = `${totalItems} items`;
//             }
//             });
//             decreaseBtn.style.color="green";
//             decreaseBtn.style.display="block";
//            itemEl.appendChild(decreaseBtn);


//            const spaceEl5=document.createElement("span");
//            spaceEl5.innerText="";
//            itemEl.appendChild(spaceEl5);

//       // Add delete button to item details
//       const deleteBtn = document.createElement("button");
//       deleteBtn.innerText = "X";
//       deleteBtn.addEventListener("click", () => {
//         itemEl.remove();
//         const index = orderedItems.indexOf(item);
//         orderedItems.splice(index, 1);
//         localStorage.setItem(`orderedItems-${tableCardAttrKey}`, JSON.stringify(orderedItems));
//         totalCostEl.innerText = `Rs${totalCost -= item.cost}`;
//         totalItemsEl.innerText = `${totalItems -= item.quantity} items`;
//       });
//       deleteBtn.style.color="red";
//       deleteBtn.style.display="block";
//       itemEl.appendChild(deleteBtn);
//     });


//      // Add total cost to popup
//      let totalCost = orderedItems.reduce((acc, item) => acc + item.cost, 0);
//      const totalCostEl = document.createElement("p");
//      totalCostEl.innerText = `Rs${totalCost}`;
//      popup.document.body.appendChild(totalCostEl);

//      //  Add total items to popup
//      let totalItems = orderedItems.reduce((acc, item) => acc + item.quantity, 0);
//      const totalItemsEl = document.createElement("p");
//      totalItemsEl.innerText = `${totalItems} items`;
//      popup.document.body.appendChild(totalItemsEl);



//         const clearAllOrders = (tableCardAttrKey) => {
            
//         const tableCard = document.querySelector(`.table-card[attr-key="${tableCardAttrKey}"]`);
          
//         const totalCostEl = tableCard.querySelector('#total-cost');
//         const totalItemsEl = tableCard.querySelector('#total-items');
//         const orderedItems = JSON.parse(localStorage.getItem(`orderedItems-${tableCardAttrKey}`)) || [];
//         orderedItems.splice(0, orderedItems.length);
//         localStorage.removeItem(`orderedItems-${tableCardAttrKey}`);
//         popup.close();
//         //location.reload();
        
//         // Check if tableCard is not null before using it
//         if (tableCard) {
//            //tableCard.click(); // re-trigger the click event to reset the table card
//           totalCostEl.innerText = "0";
//           totalItemsEl.innerText = "0";
//         }
//         };
      
//       const clearAllBtn = document.createElement("button");
//       clearAllBtn.innerText = "Close Session(Generate Bill)";
//       clearAllBtn.addEventListener("click", () => {
//         alert(`Total cost: Rs${totalCost}\nThank you for your order!`);
//         clearAllOrders(tableCardAttrKey);
//       });
//       popup.document.body.appendChild(clearAllBtn);
      
//       // Attach event listener to each table card
//       tableCards.forEach((tableCard) => {
//       tableCard.addEventListener("click", openTablePopup);
// });
// }















































// function openTablePopup() {
//     // Store a reference to the clicked table card and retrieve any ordered items from localStorage
//     selectedTableCard = this;
//     const tableCardAttrKey = this.getAttribute('attr-key');
//     let orderedItems = JSON.parse(localStorage.getItem(`orderedItems-${tableCardAttrKey}`)) || [];
  
//     // Create a popup window
//     const popup = document.createElement('div');
//     popup.classList.add('popup');
  
//     // Create a title for the popup
//     const title = document.createElement('h2');
//     title.innerText = `Table ${parseInt(tableCardAttrKey) + 1} - Ordered Items`;
//     popup.appendChild(title);
  
//     // Create a list of ordered items
//     const itemList = document.createElement('ul');
//     for (let i = 0; i < orderedItems.length; i++) {
//       const item = orderedItems[i];
//       const li = document.createElement('li');
//       const itemCost = item.cost / item.quantity; // Calculate the individual cost of the item
//       li.innerHTML = `${item.name} <span class="quantity">${item.quantity}</span> <button class="increase">+</button> <button class="decrease">-</button> <button class="delete">Delete</button>`;
//       itemList.appendChild(li);
  
//       // Add event listener to increase button
//       li.querySelector('.increase').addEventListener('click', () => {
//         item.quantity += 1;
//         item.cost += itemCost; // Increase the cost of the item by its individual cost
//         li.querySelector('.quantity').innerText = item.quantity;
//         totalCostEl.innerText = `Total Cost: $${getTotalCost(orderedItems)}`;
//         localStorage.setItem(`orderedItems-${tableCardAttrKey}`, JSON.stringify(orderedItems));
        

//       });
  
//       // Add event listener to decrease button
//       li.querySelector('.decrease').addEventListener('click', () => {
//         if (item.quantity > 1) {
//           item.quantity -= 1;
//           item.cost -= itemCost; // Decrease the cost of the item by its individual cost
//           li.querySelector('.quantity').innerText = item.quantity;
//           totalCostEl.innerText = `Total Cost: $${getTotalCost(orderedItems)}`;
//           localStorage.setItem(`orderedItems-${tableCardAttrKey}`, JSON.stringify(orderedItems));
//         }
          
//       });  
//         // Add event listener to delete button
//         li.querySelector('.delete').addEventListener('click', () => {
//             const itemName = li.innerText.split(' ')[0];
//             const item = orderedItems.find((item) => item.name === itemName);
//             const itemCost = item.cost / item.quantity;
//             orderedItems = orderedItems.filter((item) => item.name !== itemName);
//             li.remove();
//             // Update total cost after deleting item
//             totalCost -= item.cost;
//             totalCostEl.innerText = `Total Cost: $${totalCost.toFixed(2)}`;
//             localStorage.setItem(`orderedItems-${tableCardAttrKey}`, JSON.stringify(orderedItems));
//         });       
          
//     }
//     popup.appendChild(itemList);
  
//     // Create a total cost element for the popup
//     const totalCostEl = document.createElement('p');
//     totalCostEl.innerText = `Total Cost: $${getTotalCost(orderedItems)}`;
//     popup.appendChild(totalCostEl);

//     function getTotalCost(orderedItems) {
//         let totalCost = 0;
//         for (let i = 0; i < orderedItems.length; i++) {
//             const item=orderedItems[i];
//           totalCost += item.cost;
//         }
//         return totalCost;
//     }

//     function getItemPrice(item) {
//         if (item.quantity === 2) {
//           return item.cost / 2;
//         } else {
//           return item.cost / item.quantity;
//         }
//     }

   
    
    
      
//     // Add the popup to the document
//     document.body.appendChild(popup);
// }
  





  
    //   // Add increase button to item details
    //   const increaseBtn = document.createElement("button");
    //   increaseBtn.innerText = "+";
    //   increaseBtn.addEventListener("click", () => {
    //     item.quantity += 1;
    //     item.cost += itemCost;
    //     itemQuantityEl.innerText = `    x      ${item.quantity}`;
    //     itemCostEl.innerText = `      Rs${item.cost}`;
    //     totalCostEl.innerText = `     Rs${totalCost += itemCost}`;
    //     totalItemsEl.innerText = `${totalItems + 1} items`;
    //   });
    //   itemEl.appendChild(increaseBtn);
  
    //   // Add decrease button to item details
    //   const decreaseBtn = document.createElement("button");
    //   decreaseBtn.innerText = " - ";
    //   decreaseBtn.addEventListener("click", () => {
    //     if (item.quantity > 1) {
    //       item.quantity -= 1;
    //       item.cost -= itemCost;
    //       itemQuantityEl.innerText = `      x      ${item.quantity}`;
    //       itemCostEl.innerText = `       Rs${item.cost}`;
    //       totalCostEl.innerText = `      Rs${totalCost -= itemCost}`;
    //       totalItemsEl.innerText = `${totalItems } items`;

    //     }
    //   });
    //   itemEl.appendChild(decreaseBtn);








// function drop() {
//     selectedTableCard=this;
//   // Get attr-key of menu card and table card
//   const menuCardAttrKey = draggableItem.getAttribute('attr-key');
//   const tableCardAttrKey = this.getAttribute('attr-key');
//   // Get total-cost and total-items elements for the table
//   const totalCostEl = document.querySelector(`.table-card[attr-key="${tableCardAttrKey}"] #total-cost`);
//   const totalItemsEl = document.querySelector(`.table-card[attr-key="${tableCardAttrKey}"] #total-items`);
//   const itemName=draggableItem.querySelector('h2').innerText;
//   const itemCost = parseInt(draggableItem.dataset.itemCost);
//   // Update total cost and total items in table
//   let totalCost = parseInt(totalCostEl.innerText);
//   let totalItems = parseInt(totalItemsEl.innerText);
//   totalCost += itemCost;
//   totalItems += 1;
//   totalCostEl.innerText = totalCost;
//   totalItemsEl.innerText = totalItems;
//   // Reset draggableItem to null
//   draggableItem = null;
// }







// function openTablePopup() {
//     // Store a reference to the clicked table card and retrieve any ordered items from localStorage
//     selectedTableCard = this;
//     const tableCardAttrKey = this.getAttribute('attr-key');
//     const orderedItems = JSON.parse(localStorage.getItem(`orderedItems-${tableCardAttrKey}`)) || [];
  
//     // Create a popup window
//     const popup = document.createElement('div');
//     popup.classList.add('popup');
  
//     // Create a title for the popup
//     const title = document.createElement('h2');
//     title.innerText = `Table ${tableCardAttrKey + +1}- Ordered Items`;
//     popup.appendChild(title);
  
//     // Create a list of ordered items
//     const itemList = document.createElement('ul');
//     for (let i = 0; i < orderedItems.length; i++) {
//       const item = orderedItems[i];
//       const li = document.createElement('li');
//       li.innerHTML = `${item.name} <span class="quantity">${item.quantity}</span> <button class="increase">+</button> <button class="decrease">-</button> <button class="delete">Delete</button>`;
//       itemList.appendChild(li);
//     }
//     popup.appendChild(itemList);
  
//     // Create a total cost element for the popup
//     const totalCostEl = document.createElement('p');
//     const totalCost = orderedItems.reduce((acc, item) => acc + item.cost, 0);
//     totalCostEl.innerHTML = `Total Cost: <span>${totalCost}</span>`;
//     popup.appendChild(totalCostEl);
  
//     // Add event listeners to increase, decrease, and delete buttons
//     const increaseButtons = popup.querySelectorAll('.increase');
//     increaseButtons.forEach((button) => {
//       button.addEventListener('click', () => {
//         const li = button.parentNode;
//         const itemName = li.innerText.split(' ')[0];
//         const itemIndex = orderedItems.findIndex((item) => item.name === itemName);
//         orderedItems[itemIndex].quantity += 1;
//         orderedItems[itemIndex].cost += parseInt(draggableItem.dataset.itemCost);
//         localStorage.setItem(`orderedItems-${tableCardAttrKey}`, JSON.stringify(orderedItems));
//         updateTablePopup(popup, orderedItems);
//       });
//     });
  
//     const decreaseButtons = popup.querySelectorAll('.decrease');
//     decreaseButtons.forEach((button) => {
//       button.addEventListener('click', () => {
//         const li = button.parentNode;
//         const itemName = li.innerText.split(' ')[0];
//         const itemIndex = orderedItems.findIndex((item) => item.name === itemName);
//         if (orderedItems[itemIndex].quantity === 1) {
//           orderedItems.splice(itemIndex, 1);
//         } else {
//           orderedItems[itemIndex].quantity -= 1;
//           orderedItems[itemIndex].cost -= parseInt(draggableItem.dataset.itemCost);
//         }
//         localStorage.setItem(`orderedItems-${tableCardAttrKey}`, JSON.stringify(orderedItems));
//         updateTablePopup(popup, orderedItems);
//       });
//     });
  
//     const deleteButtons = popup.querySelectorAll('.delete');
//     deleteButtons.forEach((button) => {
//       button.addEventListener('click', () => {
//         const li = button.parentNode;
//         const itemName = li.innerText.split(' ')[0];
//         const itemIndex = orderedItems.findIndex((item) => item.name === itemName);
//         orderedItems.splice(itemIndex, 1);
//         localStorage.setItem(`orderedItems-${tableCardAttrKey}`, JSON.stringify(orderedItems));
//         updateTablePopup(popup, orderedItems);
//       });
//     });
  
//     // Append the popup to the body and show the overlay
//     document.body.appendChild(popup);
//     showOverlay();
// }

// function updateTablePopup(popup, orderedItems) {
//     // Update the list of ordered items
//     const itemList = popup.querySelector('ul');
//     itemList.innerHTML = '';
//     for (let i = 0; i < orderedItems.length; i++) {
//       const item = orderedItems[i];
//       const li = document.createElement('li');
//       li.innerHTML = `${item.name} <span class="quantity">${item.quantity}</span> <button class="increase">+</button> <button class="decrease">-</button> <button class="delete">Delete</button>`;
//       itemList.appendChild(li);
//     }
  
//     // Update the total cost
//     const totalCostEl = popup.querySelector('p');
//     const totalCost = orderedItems.reduce((acc, item) => acc + item.cost, 0);
//     totalCostEl.innerHTML = `Total Cost: <span>${totalCost}</span>`;
// }
