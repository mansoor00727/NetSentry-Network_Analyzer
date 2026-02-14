from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from apscheduler.triggers.interval import IntervalTrigger
import logging
from .jobs import retrain_models, update_baseline

logger = logging.getLogger(__name__)

class BackgroundScheduler:
    def __init__(self):
        self.scheduler = AsyncIOScheduler()
        
    def start(self):
        logger.info("Starting background scheduler...")
        
        # Schedule ML Retraining (Daily at midnight)
        self.scheduler.add_job(
            retrain_models,
            CronTrigger(hour=0, minute=0),
            id="ml_retrain",
            replace_existing=True
        )
        
        # Schedule Baseline Update (Hourly)
        self.scheduler.add_job(
            update_baseline,
            IntervalTrigger(hours=1),
            id="baseline_update",
            replace_existing=True
        )
        
        self.scheduler.start()

# Global instance
scheduler = BackgroundScheduler()
