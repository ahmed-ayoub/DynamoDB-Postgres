// helper Module 
module.exports = 
{

getRandomString : function () {
    var stringlength = Math.floor( Math.random() * 100 )
    if ( stringlength > 15 )
        stringlength = 15 ;
    else if ( stringlength < 3 )
        stringlength = 3 ;
    
    var charset = 'abcdefghijklmnopqrstuvwxyz';
    var result = '';
    for (var i = stringlength ; i > 0; --i) result += charset[Math.floor(Math.random() * charset.length)];
    return result;
},

getRandomNum : function(max) {
    var num = Math.floor( Math.random() * max );
    if(num ==0)
    num = 10;
    return num;
}
};
