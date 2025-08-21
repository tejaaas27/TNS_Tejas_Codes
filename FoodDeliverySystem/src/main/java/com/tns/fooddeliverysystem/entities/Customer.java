package main.java.com.tns.fooddeliverysystem.entities;
public class Customer extends User{
    private Cart cart;
    public Customer(int userId, String userName, long contactNo){
        super(userId,userName,contactNo);
        this.cart=new Cart();
    }
    public Cart getCart(){
        return cart;
    }
    @Override
    public String tString(){
        return "Customer{userId="+ getUserId()+",userName='"+getUserName()+"',contactNo="+getContactNo()+"}";
    }
}