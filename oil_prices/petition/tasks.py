from __future__ import absolute_import, unicode_literals

from celery.decorators import task
from celery.utils.log import get_task_logger

from petition.views import createMBGSimulations, createMBGMRSimulations

logger = get_task_logger(__name__)

@task(name="create_petition_prices_task")
def create_petition_prices_task(p_date, oil_reference, num_days, num_reps, sim_model, petition_id):
    logger.info("Create prices for petition")
    if sim_model == 'MBG':
        return createMBGSimulations(p_date=p_date, oil_reference=oil_reference, num_days=num_days, num_reps=num_reps, petition_id=petition_id)
    if sim_model == 'MBGMR':
        return createMBGMRSimulations(p_date=p_date, oil_reference=oil_reference, num_days=num_days, num_reps=num_reps, petition_id=petition_id)