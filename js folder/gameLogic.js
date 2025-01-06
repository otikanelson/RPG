// let currentTimeout = null;

// function typeText(text, element, speed = 50) {
//     // Clear any existing animation
//     if (currentTimeout) {
//         while (currentTimeout--) {
//             clearTimeout(currentTimeout);
//         }
//     }
    
//     // Reset text and start fresh
//     element.innerText = '';
    
//     const letters = text.split('');
//     letters.forEach((char, i) => {
//         currentTimeout = setTimeout(() => {
//             element.innerText += char;
//             if (i === letters.length - 1) {
//                 currentTimeout = null;
//             }
//         }, speed * i);
//     });
// }