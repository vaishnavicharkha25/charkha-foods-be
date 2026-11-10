import { QueryInterface } from 'sequelize';

export = {
  up: async (queryInterface: QueryInterface) => {
    const now = new Date();

    // 1. Categories
    await queryInterface.bulkInsert('categories', [
      {
        id: 'bev',
        slug: 'beverages',
        name: 'Hot & Cold Beverages',
        tagline: 'Cutting chai to cold coffee',
        display_order: 1,
        is_active: true,
        created_at: now,
        updated_at: now,
      },
      {
        id: 'snacks',
        slug: 'snacks',
        name: 'Snacks',
        tagline: 'Vada pav, samosa, momos & more',
        display_order: 2,
        is_active: true,
        created_at: now,
        updated_at: now,
      },
      {
        id: 'thali',
        slug: 'lunch-thalis',
        name: 'Lunch Thalis',
        tagline: 'Ghar jaisa full meal',
        display_order: 3,
        is_active: true,
        created_at: now,
        updated_at: now,
      },
      {
        id: 'dessert',
        slug: 'desserts',
        name: 'Ice Creams & Desserts',
        tagline: 'Sweet ending, every time',
        display_order: 4,
        is_active: true,
        created_at: now,
        updated_at: now,
      },
    ]);

    // 2. Add-Ons
    await queryInterface.bulkInsert('add_ons', [
      { id: 'a-elaichi', name: 'Extra elaichi', price: 5.00, created_at: now, updated_at: now },
      { id: 'a-adrak', name: 'Adrak (ginger)', price: 5.00, created_at: now, updated_at: now },
      { id: 'a-large', name: 'Make it large', price: 15.00, created_at: now, updated_at: now },
      { id: 'a-cheese', name: 'Cheese slice', price: 20.00, created_at: now, updated_at: now },
      { id: 'a-chutney', name: 'Extra green chutney', price: 10.00, created_at: now, updated_at: now },
      { id: 'a-butter', name: 'Extra butter roast', price: 10.00, created_at: now, updated_at: now },
      { id: 'a-chilli', name: 'Fried green chilli', price: 5.00, created_at: now, updated_at: now },
      { id: 'a-roti', name: '2 extra rotis', price: 20.00, created_at: now, updated_at: now },
      { id: 'a-rice', name: 'Extra jeera rice', price: 25.00, created_at: now, updated_at: now },
      { id: 'a-papad', name: 'Masala papad', price: 20.00, created_at: now, updated_at: now },
      { id: 'a-buttermilk', name: 'Chaas', price: 20.00, created_at: now, updated_at: now },
      { id: 'a-scoop', name: 'Extra scoop', price: 25.00, created_at: now, updated_at: now },
      { id: 'a-choco', name: 'Choco sauce', price: 10.00, created_at: now, updated_at: now },
      { id: 'a-nuts', name: 'Dry fruit topping', price: 15.00, created_at: now, updated_at: now },
    ]);

    // 3. Products
    await queryInterface.bulkInsert('products', [
      // Beverages
      { id: 'p-chai', category_id: 'bev', name: 'Charkha Cutting Chai', price: 15.00, description: 'Kadak masala chai brewed on slow flame, served cutting style.', bestseller: true, is_available: true, created_at: now, updated_at: now },
      { id: 'p-masala-chai', category_id: 'bev', name: 'Masala Chai (Large)', price: 30.00, description: 'Full glass of chai with clove, cardamom and ginger.', bestseller: false, is_available: true, created_at: now, updated_at: now },
      { id: 'p-filter-coffee', category_id: 'bev', name: 'Filter Coffee', price: 40.00, description: 'South Indian style decoction with frothy hot milk.', bestseller: false, is_available: true, created_at: now, updated_at: now },
      { id: 'p-cold-coffee', category_id: 'bev', name: 'Thick Cold Coffee', price: 90.00, description: 'Blended cold coffee with ice cream float.', offer_tag: '₹10 OFF', bestseller: true, is_available: true, created_at: now, updated_at: now },
      { id: 'p-lassi', category_id: 'bev', name: 'Sweet Lassi', price: 60.00, description: 'Thick curd lassi topped with malai and kesar strands.', bestseller: false, is_available: true, created_at: now, updated_at: now },
      { id: 'p-nimbu', category_id: 'bev', name: 'Masala Nimbu Soda', price: 35.00, description: 'Fizzy lemon soda with kala namak and jeera.', bestseller: false, is_available: true, created_at: now, updated_at: now },

      // Snacks
      { id: 'p-vadapav', category_id: 'snacks', name: 'Classic Vada Pav', price: 25.00, description: 'Our hero. Batata vada, dry garlic chutney, butter-roasted pav.', offer_tag: 'BUY 2 GET 1', bestseller: true, is_available: true, created_at: now, updated_at: now },
      { id: 'p-cheese-vadapav', category_id: 'snacks', name: 'Cheese Burst Vada Pav', price: 50.00, description: 'Vada pav loaded with molten cheese and schezwan chutney.', bestseller: true, is_available: true, created_at: now, updated_at: now },
      { id: 'p-samosa', category_id: 'snacks', name: 'Punjabi Samosa (2 pc)', price: 30.00, description: 'Flaky samosa stuffed with masala aloo and peas.', bestseller: false, is_available: true, created_at: now, updated_at: now },
      { id: 'p-momos', category_id: 'snacks', name: 'Steamed Veg Momos (6 pc)', price: 70.00, description: 'Hand-pleated momos with cabbage-carrot filling, fiery chutney.', bestseller: true, is_available: true, created_at: now, updated_at: now },
      { id: 'p-fried-momos', category_id: 'snacks', name: 'Fried Chilli Momos (6 pc)', price: 90.00, description: 'Crisp fried momos tossed in chilli-garlic sauce.', offer_tag: 'NEW', bestseller: false, is_available: true, created_at: now, updated_at: now },
      { id: 'p-sandwich', category_id: 'snacks', name: 'Bombay Masala Sandwich', price: 60.00, description: 'Triple layer sandwich with aloo masala, chutney and chaat masala.', bestseller: false, is_available: true, created_at: now, updated_at: now },
      { id: 'p-grill-sandwich', category_id: 'snacks', name: 'Cheese Grilled Sandwich', price: 85.00, description: 'Grilled till golden, oozing cheese with capsicum and corn.', bestseller: false, is_available: true, created_at: now, updated_at: now },
      { id: 'p-fries', category_id: 'snacks', name: 'Masala Fries', price: 60.00, description: 'Crunchy fries dusted with our house peri-masala.', bestseller: false, is_available: true, created_at: now, updated_at: now },
      { id: 'p-cheese-fries', category_id: 'snacks', name: 'Cheesy Loaded Fries', price: 110.00, description: 'Fries drowned in cheese sauce, jalapeño and herbs.', offer_tag: 'COMBO SAVER', bestseller: false, is_available: true, created_at: now, updated_at: now },
      { id: 'p-misalpav', category_id: 'snacks', name: 'Misal Pav', price: 80.00, description: 'Spicy sprouts misal with farsan, onion and two pav.', bestseller: false, is_available: false, created_at: now, updated_at: now },

      // Thalis
      { id: 'p-mini-thali', category_id: 'thali', name: 'Mini Veg Thali', price: 90.00, description: 'Dal, one sabzi, 3 roti, rice, salad and pickle.', serves: 'Serves 1', bestseller: true, is_available: true, created_at: now, updated_at: now },
      { id: 'p-special-thali', category_id: 'thali', name: 'Charkha Special Thali', price: 110.00, description: 'Two sabzi, dal fry, jeera rice, 4 roti, sweet and papad.', serves: 'Serves 1', offer_tag: '₹15 OFF', bestseller: false, is_available: true, created_at: now, updated_at: now },
      { id: 'p-rajma', category_id: 'thali', name: 'Rajma Chawal Bowl', price: 95.00, description: 'Slow-cooked rajma over steamed rice with onion salad.', serves: 'Serves 1', bestseller: false, is_available: true, created_at: now, updated_at: now },
      { id: 'p-chole', category_id: 'thali', name: 'Chole Kulcha Plate', price: 100.00, description: 'Amritsari chole with butter kulcha and pickled onion.', serves: 'Serves 1', bestseller: false, is_available: true, created_at: now, updated_at: now },

      // Desserts
      { id: 'p-vanilla', category_id: 'dessert', name: 'Vanilla Ice Cream Cup', price: 40.00, description: 'Creamy vanilla single scoop cup.', bestseller: false, is_available: true, created_at: now, updated_at: now },
      { id: 'p-choco-sundae', category_id: 'dessert', name: 'Choco Brownie Sundae', price: 105.00, description: 'Brownie chunks, vanilla scoops, hot chocolate sauce.', bestseller: true, is_available: true, created_at: now, updated_at: now },
      { id: 'p-gulab', category_id: 'dessert', name: 'Gulab Jamun (2 pc)', price: 45.00, description: 'Warm jamuns soaked in cardamom syrup.', bestseller: false, is_available: true, created_at: now, updated_at: now },
      { id: 'p-kulfi', category_id: 'dessert', name: 'Malai Kulfi Stick', price: 50.00, description: 'Traditional slow-cooked malai kulfi with pista.', offer_tag: 'SUMMER PICK', bestseller: false, is_available: true, created_at: now, updated_at: now },
      { id: 'p-shahi', category_id: 'dessert', name: 'Shahi Tukda', price: 10.00, description: 'Single-piece taster of fried bread in rabdi. Add to any order.', bestseller: false, is_available: true, created_at: now, updated_at: now },
    ]);

    // 4. Product Add-Ons Mapping
    const chaiProducts = ['p-chai', 'p-masala-chai', 'p-filter-coffee'];
    const chaiAddOnIds = ['a-elaichi', 'a-adrak', 'a-large'];

    const snackProducts = ['p-vadapav', 'p-cheese-vadapav', 'p-samosa', 'p-momos', 'p-fried-momos', 'p-sandwich', 'p-grill-sandwich', 'p-fries', 'p-cheese-fries', 'p-misalpav'];
    const snackAddOnIds = ['a-cheese', 'a-chutney', 'a-butter', 'a-chilli'];

    const thaliProducts = ['p-mini-thali', 'p-special-thali', 'p-rajma', 'p-chole'];
    const thaliAddOnIds = ['a-roti', 'a-rice', 'a-papad', 'a-buttermilk'];

    const dessertProducts = ['p-vanilla', 'p-choco-sundae', 'p-gulab', 'p-kulfi', 'p-cold-coffee', 'p-lassi'];
    const dessertAddOnIds = ['a-scoop', 'a-choco', 'a-nuts'];

    const productAddOnsData: { product_id: string; add_on_id: string }[] = [];

    chaiProducts.forEach(p => chaiAddOnIds.forEach(a => productAddOnsData.push({ product_id: p, add_on_id: a })));
    snackProducts.forEach(p => snackAddOnIds.forEach(a => productAddOnsData.push({ product_id: p, add_on_id: a })));
    thaliProducts.forEach(p => thaliAddOnIds.forEach(a => productAddOnsData.push({ product_id: p, add_on_id: a })));
    dessertProducts.forEach(p => dessertAddOnIds.forEach(a => productAddOnsData.push({ product_id: p, add_on_id: a })));

    await queryInterface.bulkInsert('product_add_ons', productAddOnsData);

    // 5. Coupons
    await queryInterface.bulkInsert('coupons', [
      { code: 'CHARKHA10', label: '10% off on orders above ₹150', discount_type: 'percent', value: 10.00, min_order_amount: 150.00, is_active: true, created_at: now, updated_at: now },
      { code: 'VADA20', label: 'Flat ₹20 off on snacks above ₹120', discount_type: 'flat', value: 20.00, min_order_amount: 120.00, is_active: true, created_at: now, updated_at: now },
      { code: 'THALI15', label: 'Flat ₹15 off on thali orders above ₹200', discount_type: 'flat', value: 15.00, min_order_amount: 200.00, is_active: true, created_at: now, updated_at: now },
      { code: 'SOCIETY50', label: '₹50 off society bulk orders above ₹500', discount_type: 'flat', value: 50.00, min_order_amount: 500.00, is_active: false, created_at: now, updated_at: now },
    ]);

    // 6. Offer Banners
    await queryInterface.bulkInsert('offer_banners', [
      { id: 'o1', title: 'Buy 2 Vada Pav,\nGet 1 Free', subtitle: 'Every day, 4 PM – 7 PM', code: 'AUTO APPLIED', is_active: true, display_order: 1, created_at: now, updated_at: now },
      { id: 'o2', title: 'Thali + Chai\nat ₹110', subtitle: 'Lunch hours combo saver', code: 'THALI15', is_active: true, display_order: 2, created_at: now, updated_at: now },
      { id: 'o3', title: '10% off your\nfirst app order', subtitle: 'Minimum order ₹150', code: 'CHARKHA10', is_active: true, display_order: 3, created_at: now, updated_at: now },
    ]);

    // 7. QR Sources
    await queryInterface.bulkInsert('qr_sources', [
      { id: 'q1', label: 'Sunrise Society – Wing B', type: 'Society', scans_count: 412, orders_count: 128, created_at: now, updated_at: now },
      { id: 'q2', label: 'Zenith Commercial Building – Lobby', type: 'Commercial building', scans_count: 806, orders_count: 254, created_at: now, updated_at: now },
      { id: 'q3', label: 'Outlet Table 4', type: 'Table', scans_count: 198, orders_count: 91, created_at: now, updated_at: now },
      { id: 'q4', label: 'Billing Counter Standee', type: 'Counter', scans_count: 322, orders_count: 140, created_at: now, updated_at: now },
    ]);
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete('qr_sources', {});
    await queryInterface.bulkDelete('offer_banners', {});
    await queryInterface.bulkDelete('coupons', {});
    await queryInterface.bulkDelete('product_add_ons', {});
    await queryInterface.bulkDelete('products', {});
    await queryInterface.bulkDelete('add_ons', {});
    await queryInterface.bulkDelete('categories', {});
  },
};
