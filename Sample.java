public class Sample{
    public static void main(String[] args) {
        // int[] arr = {10,10,10};
        String s1 = "programming";
        System.out.println(unique(s1));
    }
    public static String unique(String st){
        int[] ascii = new int[256];
        StringBuilder result = new StringBuilder();
        for(int i=0;i<st.length();i++){
            Character ch = st.charAt(i);
            if(ascii[ch]!=1){
                ascii[ch] = 1;
                result.append(ch);
            }
        }
        
        return result.toString();
    }
    public void middle(){
        Node slow = head;
        Node fast = head.next.next;
        while(fast!=null){
            slow = slow.next;
            fast = fast.next.next;
        }
        return slow;
    }
}