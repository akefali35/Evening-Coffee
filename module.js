// Module factory function that accepts APP_ID as parameter
module.exports = function createAppModule(APP_ID) {
    const express = require('express');
    const path = require('path');
    const fs = require('fs');
  
    const app = express();
  
    // ===== SMART ROUTING DETECTION =====
    // Detect if running standalone (server.js) or embedded (parent server)
    const IS_EMBEDDED = global.PARENT_SERVER_MODE || process.env.EMBEDDED_MODE;
    const API_BASE = IS_EMBEDDED ? `/api/${APP_ID}` : '';
  
    // ===== BASIC MIDDLEWARE =====
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static('.'));
  
    // ===== CORS SUPPORT =====
    app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
      if (req.method === 'OPTIONS') {
        res.sendStatus(200);
      } else {
        next();
      }
    });
  
    // ===== CONTACT FORM HANDLING =====
    app.post(`${API_BASE}/contact`, (req, res) => {
      try {
        const { name, email, message } = req.body;
        
        // Log the contact form submission
        console.log('📧 Contact form submission:', {
          name,
          email,
          message: message.substring(0, 100) + '...',
          timestamp: new Date().toISOString()
        });
  
        // In a real application, you would:
        // 1. Save to database
        // 2. Send email notification
        // 3. Add to CRM system
        
        res.json({ 
          success: true, 
          message: 'Thank you for your message! We\'ll get back to you soon.' 
        });
      } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({ 
          success: false, 
          error: 'Failed to send message. Please try again.' 
        });
      }
    });
  
    // ===== RESERVATION HANDLING =====
    app.post(`${API_BASE}/reservation`, (req, res) => {
      try {
        const reservationData = req.body;
        
        // Log the reservation
        console.log('🍽️ Table reservation:', {
          ...reservationData,
          timestamp: new Date().toISOString()
        });
  
        // In a real application, you would:
        // 1. Check table availability
        // 2. Save reservation to database
        // 3. Send confirmation email/SMS
        // 4. Add to restaurant management system
        
        res.json({ 
          success: true, 
          message: 'Your table has been reserved! We\'ll call you to confirm the details.',
          reservationId: 'EC' + Date.now()
        });
      } catch (error) {
        console.error('Reservation error:', error);
        res.status(500).json({ 
          success: false, 
          error: 'Failed to make reservation. Please try again.' 
        });
      }
    });
  
    // ===== MENU API =====
    app.get(`${API_BASE}/menu`, (req, res) => {
      try {
        const menu = [
          {
            id: 1,
            name: "Turkish Coffee",
            description: "Traditional Turkish coffee served with Turkish delight",
            price: 4.50,
            category: "Traditional",
            available: true
          },
          {
            id: 2,
            name: "Espresso",
            description: "Rich and bold single shot of premium espresso",
            price: 3.00,
            category: "Espresso",
            available: true
          },
          {
            id: 3,
            name: "Latte",
            description: "Smooth espresso with steamed milk and light foam",
            price: 5.50,
            category: "Milk Coffee",
            available: true
          },
          {
            id: 4,
            name: "Cappuccino",
            description: "Perfect balance of espresso, steamed milk, and foam",
            price: 5.00,
            category: "Milk Coffee",
            available: true
          },
          {
            id: 5,
            name: "Americano",
            description: "Espresso shots with hot water for a clean taste",
            price: 3.50,
            category: "Espresso",
            available: true
          },
          {
            id: 6,
            name: "Mocha",
            description: "Espresso with chocolate syrup and steamed milk",
            price: 6.00,
            category: "Specialty",
            available: true
          }
        ];
  
        res.json({ success: true, menu });
      } catch (error) {
        console.error('Menu API error:', error);
        res.status(500).json({ success: false, error: 'Failed to load menu' });
      }
    });
  
    // ===== STORE INFO API =====
    app.get(`${API_BASE}/info`, (req, res) => {
      try {
        const storeInfo = {
          name: "Evening Coffee",
          address: "123 Coffee Street, Downtown District, City 12345",
          phone: "+1 (555) 123-4567",
          email: "hello@eveningcoffee.com",
          hours: {
            monday: "7:00 AM - 10:00 PM",
            tuesday: "7:00 AM - 10:00 PM",
            wednesday: "7:00 AM - 10:00 PM",
            thursday: "7:00 AM - 10:00 PM",
            friday: "7:00 AM - 10:00 PM",
            saturday: "7:00 AM - 10:00 PM",
            sunday: "7:00 AM - 10:00 PM"
          },
          established: 2018,
          social: {
            facebook: "#",
            instagram: "#",
            twitter: "#",
            linkedin: "#"
          }
        };
  
        res.json({ success: true, info: storeInfo });
      } catch (error) {
        console.error('Store info API error:', error);
        res.status(500).json({ success: false, error: 'Failed to load store information' });
      }
    });
  
    // ===== DEFAULT ROUTES =====
    // Serve the main HTML file
    app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, 'index.html'));
    });
  
    // Health check endpoint
    app.get(`${API_BASE}/health`, (req, res) => {
      res.json({ 
        status: 'ok', 
        appId: APP_ID,
        name: 'Evening Coffee Website',
        version: '1.0.0'
      });
    });
  
    // ===== ERROR HANDLING =====
    app.use((err, req, res, next) => {
      console.error('App error:', err);
      res.status(500).json({ error: 'Internal server error' });
    });
  
    console.log(`☕ Evening Coffee module initialized for app ${APP_ID}`);
    return app;
  };