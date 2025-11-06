#!/bin/bash

# Example script for testing the Users Microservice locally
# This script demonstrates how to interact with the API

BASE_URL="http://localhost:5000"

echo "=== Testing Flask Users Microservice ==="
echo ""

# Test 1: Health Check
echo "1. Testing Health Check Endpoint"
echo "GET $BASE_URL/health"
curl -s "$BASE_URL/health" | python3 -m json.tool
echo -e "\n"

# Test 2: Get All Users
echo "2. Getting All Users"
echo "GET $BASE_URL/users"
curl -s "$BASE_URL/users" | python3 -m json.tool
echo -e "\n"

# Test 3: Create a New User
echo "3. Creating a New User"
echo "POST $BASE_URL/users"
curl -s -X POST "$BASE_URL/users" \
  -H "Content-Type: application/json" \
  -d '{"username":"test_user","email":"test@example.com"}' | python3 -m json.tool
echo -e "\n"

# Test 4: Get User by ID
echo "4. Getting User by ID (ID=1)"
echo "GET $BASE_URL/users/1"
curl -s "$BASE_URL/users/1" | python3 -m json.tool
echo -e "\n"

# Test 5: Get Non-existent User
echo "5. Testing Non-existent User (ID=999)"
echo "GET $BASE_URL/users/999"
curl -s "$BASE_URL/users/999" | python3 -m json.tool
echo -e "\n"

echo "=== Tests Complete ==="
