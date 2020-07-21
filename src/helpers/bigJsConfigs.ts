import Big from 'big.js';

const CustomBig = Big();

// always round_down when using functions like toFixed()
CustomBig.RM = 0;

export default CustomBig;
