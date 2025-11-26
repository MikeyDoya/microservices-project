package com.ecs.orderservice.service;

import com.ecs.orderservice.entity.Order;
import com.ecs.orderservice.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }

    public Order createOrder(Order order) {
        if (order.getStatus() == null || order.getStatus().isEmpty()) {
            order.setStatus("PENDING");
        }
        return orderRepository.save(order);
    }

    public Optional<Order> updateOrder(Long id, Order orderDetails) {
        Optional<Order> existingOrder = orderRepository.findById(id);
        if (existingOrder.isPresent()) {
            Order order = existingOrder.get();
            order.setCustomerName(orderDetails.getCustomerName());
            order.setProductName(orderDetails.getProductName());
            order.setQuantity(orderDetails.getQuantity());
            order.setTotalPrice(orderDetails.getTotalPrice());
            order.setStatus(orderDetails.getStatus());
            return Optional.of(orderRepository.save(order));
        }
        return Optional.empty();
    }

    public boolean deleteOrder(Long id) {
        if (orderRepository.existsById(id)) {
            orderRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public List<Order> getOrdersByStatus(String status) {
        return orderRepository.findByStatus(status);
    }

    public List<Order> getOrdersByCustomerName(String customerName) {
        return orderRepository.findByCustomerName(customerName);
    }
}
