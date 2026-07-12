from datetime import date
from .models import Driver
from rest_framework.exceptions import ValidationError

class DriverService:
    @staticmethod
    def check_can_dispatch(driver):
        """
        Business Rule: Cannot dispatch if Suspended (safety score < 60), License Expired, or already On Trip (status = 'On Duty').
        """
        # License expired check
        if driver.license_expiry and driver.license_expiry < date.today():
            raise ValidationError(f"Driver {driver.name} has an expired driver's license.")
            
        # Safety score check
        if driver.safety_score < 60:
            raise ValidationError(f"Driver {driver.name} is suspended due to a low safety score ({driver.safety_score}).")
            
        # Status availability check
        if driver.status == 'On Duty':
            raise ValidationError(f"Driver {driver.name} is already active on another route.")
            
        if driver.status == 'Sick':
            raise ValidationError(f"Driver {driver.name} is currently out sick and unavailable.")
            
        return True

    @staticmethod
    def update_status(driver, status):
        driver.status = status
        driver.save()
        return driver

    @staticmethod
    def add_activity(driver, activity_text):
        if not driver.recent_activity:
            driver.recent_activity = []
        driver.recent_activity.insert(0, activity_text)
        driver.recent_activity = driver.recent_activity[:5] # Keep last 5
        driver.save()
        return driver
