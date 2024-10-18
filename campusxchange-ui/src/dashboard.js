
import React, { useState } from 'react';
import './Dashboard.css'; // Assuming your original CSS is here

const Dashboard = () => {
  const [offerStatus, setOfferStatus] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false); // State to manage form visibility

  const handleAccept = () => {
    setOfferStatus('accepted');
  };

  const handleDecline = () => {
    setOfferStatus('declined');
  };

  const handleAddItemClick = () => {
    setIsFormVisible(true); // Show the form
  };

  const handleCancelClick = () => {
    setIsFormVisible(false); // Hide the form
  };

  return (
    <div className="dashboard-container">
      {/* Dashboard content */}
      <div className="header">
        <div className="logo">
          <h1>CampusXchange</h1>
        </div>
        <div className="nav-links">
          <a href="#wishlist">Wishlist</a>
          <a href="#dashboard" className="active">Dashboard</a>
          <a href="#history">History</a>
        </div>
        <div className="header-right">
          <img src="settings-icon-url" alt="Settings" className="settings-icon" />
          <button className="reset-password-btn">Reset Password</button>
          <button className="logout-btn">Logout</button>
        </div>
      </div>

      {/* Main content */}
      <div className="content">
        <h2>Dashboard</h2>
        <p>Easily manage or add your items on CampusXchange. You can review, accept or decline offers for your items here. Don’t forget to mark your item as sold after the transaction is completed.</p>
        <button className="add-item-btn" onClick={handleAddItemClick}>ADD ITEM FOR SALE +</button>

        {/* Item Listing */}
        <div className="item-listing">
          <div className="item-details">
            <img src="https://via.placeholder.com/100" alt="Dell Chromebook 3180" className="item-image" />
            <div className="item-info">
              <h4>Dell Chromebook 3180</h4>
              <p>16 GB RAM<br />15" TouchScreen<br />Webcam</p>
              <button className="mark-sold-btn">Mark Sold</button>
            </div>
          </div>

          <div className="offer-details">
            <table className="offer-table">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>From</th>
                  <th>Contact</th>
                  <th>Offer Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>sam@my.unt.edu</td>
                  <td>Unavailable</td>
                  <td>$325.00</td>
                  <td>
                    <button
                      className={`accept-btn ${offerStatus === 'accepted' ? 'disabled' : ''}`}
                      onClick={handleAccept}
                      disabled={offerStatus === 'accepted'}>
                      Accept
                    </button>
                    <button
                      className={`decline-btn ${offerStatus === 'declined' ? 'disabled' : ''}`}
                      onClick={handleDecline}
                      disabled={offerStatus === 'declined'}>
                      Decline
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Form Modal - Visible when isFormVisible is true */}
      {isFormVisible && (
        <div className="form-modal">
          <div className="form-container">
            <h3>Add an Item for Sale</h3>
            <form>
              <label>Product Name</label>
              <input type="text" placeholder="Enter product name" />
              
              <label>Description</label>
              <input type="text" placeholder="Enter product description" />
              
              <label>Category</label>
              <input type="text" placeholder="Enter category" />
              
              <label>Condition</label>
              <input type="text" placeholder="Enter condition" />
              
              <label>Price</label>
              <input type="text" placeholder="Enter price" />
              
              <label>Upload Image Files</label>
              <input type="file" />
              
              <label>Quantity</label>
              <input type="text" placeholder="Enter quantity" />

              <div className="form-buttons">
                <button type="button" className="cancel-btn" onClick={handleCancelClick}>Cancel</button>
                <button type="submit" className="submit-btn">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
