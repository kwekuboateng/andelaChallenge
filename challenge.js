<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Mini App</title>
    <style>
      body {
        margin: 0;
        padding: 1em;
        background-color: #fff;
      }
      [data-credit-card]{
        width: 435px;
        min-height: 240px;
        border-radius: 10px;
        background: #5d6874;
      }
      [data-cart-info],
      [data-credit-card] {
        transform: scale(0.78);
    	margin-left: -3.4em;
      }
      [data-cart-info] span{
        display: inline-block;
        vertical-align: middle;
        
      }
      .material-icons{
        font-size: 150px;
      }
      [data-card-type]{
        display: block;
        width: 120px;
        height: 60px;
      }
      [data-cc-digits] input{
        color: #fff;
        font-size: 2em;
        line-height: 2em;
        border: none;
        margin-right: 0.5em;
        background: none;
      }
      [data-cc-info] input:focus,
      [data-cc-digits] input:focus {
        outline: none;
      }
      [data-pay-btn]{
        position: fixed;
        width: 90%;
        border: 1px solid;
        bottom: 20px;
      }
      [data-cc-digits]{
        margin-top: 2em;
      }
      [data-cc-info]{
        margin-top: 1em;
      }
      [data-cc-info] input {
        color: #fff;
        font-size: 1.2em;
        border: none;
        background: none;
      }
      [data-cc-info] input:nth-child(2){
        padding-right: 10px;
        float: right;
      }
      .mdc-card__primary-action,
      .mdc-card__primary-action:hover {
        cursor: auto;
        padding: 20px;
        min-height: inherit;
      }
      
      [data-credit-card] [data-card-type] {
        transition: width 1.5s;
        margin-left: calc(100% - 130px);
      }

      [data-credit-card].is-visa {
        background: linear-gradient(135deg, #622774 0%, #c53364 100%);
      }

      [data-credit-card].is-mastercard {
        background: linear-gradient(135deg, #65799b 0%, #5e2563 100%);
      }

      .is-visa [data-card-type],
      .is-mastercard [data-card-type] {
        width: auto;
      }

      input.is-invalid,
      .is-invalid input {
        text-decoration: line-through;
      }

      ::placeholder {
        color: #fff;
      }
    </style>
  </head>
  <body>
    <div data-cart-info>
      <h1 class="mdc-typography--headline4">
        <span class="material-icons">shopping_cart</span>
        <span data-bill></span>
      </h1>
    </div>
      <div data-credit-card class="mdc-card mdc-card--outlined">
        <div class="mdc-card__primary-action">
          <img data-card-type="" src="https://placehold.it/120x60.png?text=Card"/>
          <div data-cc-digits>
            <input type="text" size="4" placeholder="----">
            <input type="text" size="4" placeholder="----">
            <input type="text" size="4" placeholder="----">
            <input type="text" size="4" placeholder="----">
          </div>
          <div data-cc-info>
            <input type="text" size="20" placeholder="Name Surname">
            <input type="text" size="6" placeholder="MM/YY">
          </div>
        </div>
      </div>
     <button class="mdc-button" data-pay-btn>Pay & Checkout Now</button>
   
    
    <script>
     const appState = {};
      
      
      //falIfInvalida function
      const flagIfInvalid = (field, isValid) => {
        
        if(isValid){
          field.classList.remove('is-invalid');
        }
        
        else {
          field.classList.add('is-invalid');
        }
      }
      
      
      //expiryDateFormatIsValid function 
      
      const expiryDateFormatIsValid = (target)=> {
        const dateFormat = /^(0?[1-9]|1[012])[//]\d{2}$/
        return dateFormat.test(target)
      }
      
      //supportedCards function
      
       const supportedCards = {
        visa, mastercard
      }
       
      
       //detectCardType function
       
      const detectCardType = ({target}) => {
     	const cardN = target.value;
        
        const visaCard = cardN.startsWith('4');
        const masterCard = cardN.startsWith('5');
        let cardType = "";
        let creditCard = document.querySelector("[data-credit-card]");
        let imageCard = document.querySelector("[data-card-type]");
        
        if(visaCard){
          creditCard.classList.remove("is-mastercard");
          creditCard.classList.add("is-visa");
          imageCard.src = supportedCards.visa;
         
           return `is-visa`;
         
          
        }else if (masterCard){
          creditCard.classList.remove("is-visa");
          creditCard.classList.add("is-mastercard");
          imageCard.src = supportedCards.mastercard;
           return `is-mastercard`;
        }else {
          console.log('error here')
        }
   
      };
      
      
      //validateWithLuhn function 
      
       const validateWithLuhn = (digits) => {        
        let hasInvalidChars = digits.some(digit => {
          return (typeof digit !== 'number');
        });
        
        let hasValidChecksum = (digits => {
          let checksum = digits.reverse().map((digit,index) => {
            let computedDigit = digit;

            if((index + 1) % 2 == 0){
              computedDigit *= 2;
              if(computedDigit > 9){
                computedDigit -= 9;
              }
            }

            return computedDigit;
          }).reduce(((sum,digit) => {
            return sum + digit;
          }),0);
          
          return ((checksum % 10) == 0);
        })(digits);
        
        return (digits.length == 16) && !hasInvalidChars && hasValidChecksum;
      };
      
      
      //validateCardNumber function
      
      
     //validate Card Number
    const validateCardNumber = (digit) => {
      let values = '';
      document.querySelectorAll('[data-cc-digits] input').forEach(inputField=>{
        values += inputField.value
      })

      const digits = values.split('').map(value=>{
        return parseInt(value)
      })

      let isValidCardNumber = validateWithLuhn(digits)
      if(isValidCardNumber){
        document.querySelector('[data-cc-digits]').classList.remove('is-invalid')
      }else{
        document.querySelector('[data-cc-digits]').classList.add('is-invalid')
      }
      return isValidCardNumber;
    };
      
       
     //validateCardExpiryDate 
       
       
  const validateCardExpiryDate = ({target}) => {
        let bool = expiryDateFormatIsValid(target.value);
        
        if(bool){
          
          let dateArr = target.value.split('/');
          const month = dateArr[0];
          const year = '20' + dateArr[1];
          const expDate = new Date(year + '-' + month + '-01');
          
          if(expDate > new Date()){
            flagIfInvalid(target, true);
            return true;
          }else{
            flagIfInvalid(target, false)
          return false;
          }
          
          //return false;
        }else{
          flagIfInvalid(target, false)
          return false;
         
        }
      };
      
      
      //validateCardHolderName
      
      
     const validateCardHolderName = ({target}) => {
       const cardholder = target.value.split(' ');

       if (target.value.indexOf(' ') >= 0){
         // Check if name is not less than 2
         if (cardholder.length > 2){
           flagIfInvalid(target,false);
           return false;
         } else {
           //check if name is not less than 3
           for (let i=0; i < cardholder.length; i++) {
             if (cardholder[i].length < 3){
               flagIfInvalid(target,false);
               return false;
             } else {
               flagIfInvalid(target,true);
             }
           }
           return true;
         }
       } else {
         flagIfInvalid(target,false);
         return false;
       }
     };
      
      
   		//uiCanInteract function
      
      const uiCanInteract = () => {
     		const dataDigits = document.querySelector("[data-cc-digits] input:nth-child(1)");
        
        	dataDigits.addEventListener("blur", detectCardType);
       
        
        	const dataInfo = document.querySelector("[data-cc-digits] input:nth-child(1)");
        	dataInfo.addEventListener('blur', validateCardHolderName);
        	
        	const cardDate = document.querySelector("div[data-cc-info]:nth-child(2)");
        	cardDate.addEventListener("blur", validateCardExpiryDate);
        
        	const payBtn = document.querySelector("button[data-pay-btn]");
        		payBtn.addEventListener('click', validateCardNumber);
        
        	dataDigits.focus();
      };
      
      
      //displayCartTotal function 
      
      const displayCartTotal = ({results}) => {
        
        const [data] = results;
        
        const {itemsInCart, buyerCountry} = data;
        
        appState.items = itemsInCart;
        
        appState.country = buyerCountry;
        
        appState.bill = itemsInCart.reduce((item, num) => {
         return (item.price * item.qty) + (num.price * num.qty)
        });
        
        appState.billFormatted = formatAsMoney(appState.bill,                       appState.country);
   
        document.querySelector('[data-bill]').textContent =                           appState.billFormatted;
        
        uiCanInteract();
      };
      
      
      //fetchBill function 
      
      const fetchBill = () => {
        const api = 'https://randomapi.com/api/006b08a801d82d0c9824dcfdfdfa3b3c';
        
        fetch (api)
        	.then(response => response.json())
        	.then(data => displayCartTotal(data))
        	.catch(error => console.log('error: ', error))
      };
      
      
      //countries array 
      
      const countries = [
        {
          code: "US",
          currency: "USD",
          country: 'United States'
        },
        {
          code: "NG",
          currency: "NGN",
          country: 'Nigeria'
        },
        {
          code: 'KE',
          currency: 'KES',
          country: 'Kenya'
        },
        {
          code: 'UG',
          currency: 'UGX',
          country: 'Uganda'
        },
        {
          code: 'RW',
          currency: 'RWF',
          country: 'Rwanda'
        },
        {
          code: 'TZ',
          currency: 'TZS',
          country: 'Tanzania'
        },
        {
          code: 'ZA',
          currency: 'ZAR',
          country: 'South Africa'
        },
        {
          code: 'CM',
          currency: 'XAF',
          country: 'Cameroon'
        },
        {
          code: 'GH',
          currency: 'GHS',
          country: 'Ghana'
        }
      ];
      
      //formatAsMoney function 
      
const formatAsMoney = (amount, buyerCountry) => {
       	let code = 'US';
        let currency = 'USD';
        
        countries.filter(results => {
          if (results.country == buyerCountry) {
            code = results.code;
            currency = results.currency;
          }
        });
       let options = {style: 'currency', currency: `${currency}`}
       return amount.toLocaleString(`en-${code}`, options);
      };
   
      

      const startApp = () => {
        fetchBill();
      };
      
      startApp();
      
    </script>
  </body>
</html>
