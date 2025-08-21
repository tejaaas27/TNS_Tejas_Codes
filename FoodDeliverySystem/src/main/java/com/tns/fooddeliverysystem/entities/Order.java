package com.tns.fooddeliverysystem.entities;

public class Order {
    private int orderId;
    private Customer customer;
    // private Map<FoodItem, Integer> items = new HashMap<>();
    private String Status  = "Pending";
    private DeliveryPerson deliveryPerson;
    private String deliveryAddress;

    //constructor
    public Order(int orderId, Customer customer){
        this.orderId = orderId;
        this.customer = customer;
    }
}
