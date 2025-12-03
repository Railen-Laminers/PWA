// src/components/ProfileSettings.jsx
import React from 'react';
import UpdateProfile from './UpdateProfile';

const ProfileSettings = () => {
    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-lg-10 col-xl-8">
                    <UpdateProfile />
                </div>
            </div>
        </div>
    );
};

export default ProfileSettings;