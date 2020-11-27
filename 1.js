/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
function ListNode(val) {
    this.val = val;
    this.next = null;
}
var addTwoNumbers = function(l1, l2) {
   let str1 = '', str2 = '';
   while(l1){
       str1 = str1+ l1.val
       l1 = l1.next
   }
   while(l2){
       str2 = str2 + l2.val
       l2 = l2.next
   }
   let next = null
   let count = 0
   for (let i = str1.length - 1, j = str2.length - 1; i>=0 || j>=0;i--,j--){
       let result = (str1[i] | 0) + (str2[j] | 0) + count
       if(result / 10 >= 1){
           count = Math.floor(result / 10)
           result = result % 10
       } else {
           count = 0
       }
       const l3 = new ListNode(result)
       if(next){
           l3.next = next
       }
       next = l3
   }
   if(count > 0){
       const l3 = new ListNode(count)
       l3.next = next
       next = l3
   }
   return next
};