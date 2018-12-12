sumArrayValues = (input) => {
  const total =  0;
  //for(let i=0;i<input.length;i++) {
  for(i of input) {
    if(isNaN(input[i])){
      continue
    }
    total += Number(input[i])
  }
  return total
}




////


getAmounts = (object) => {
  let arr = [];
  for (const x of Object.values(object)) {
    arr.push(x.amount);
  }
  return arr;
}


////



  sumOwed_backup = (member) => {
    // const splitBills = this.state.entries.filter(p => p.proportions);//probably use map
    const splitRates = this.state.entries.filter(p => p.proportions);//probably use map
    const owedArr = this.state.entries.map(entry => {
      const cost = entry.amount; //50
      const memberPortion = entry.proportions ? entry.proportions : {};
      const jessePortion = memberPortion ? memberPortion['jesse'] : 0;
      const owed = cost * jessePortion;
      return owed;
    })
    // [{jessie: 0.5, maria: 0.5, steve: 0.5}, ...]
    // console.log(member + ' splitBills ' + splitBills);
    let memberPortion = [];
    // debugger;
    for (const bill of splitRates) {
      //console.log('bill: ' + bill);
      //console.log(bill);
      //console.log(member + ' in splitBills loop');
      const amount = bill.amount;
      for (const [key, value] of Object.entries(bill.proportions)) {
        if (key === member) {
          //console.log(member);
        // debugger;
          memberPortion.push(value * amount);
          //console.log(memberPortion);
        }
      }
    }
    if (memberPortion.length > 0) {
      //console.log(member + ' memberPortion > 0');
      // debugger;
      const sum = this.roundToTwoDecimalPlaces(memberPortion.reduce(this.getSum))

      return sum
    } else {
      //console.log(member + ' memberPortion is not > 0: ' + memberPortion);
      const sum = memberPortion
      return sum
    }
    // return sum
  }


  ////

  
