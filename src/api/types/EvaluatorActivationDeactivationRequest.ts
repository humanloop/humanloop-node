/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as Humanloop from "../index";

export interface EvaluatorActivationDeactivationRequest {
    /** Evaluators to activate for Monitoring. These will be automatically run on new Logs. */
    activate?: Humanloop.EvaluatorActivationDeactivationRequestActivateItem[];
    /** Evaluators to deactivate. These will not be run on new Logs. */
    deactivate?: Humanloop.EvaluatorActivationDeactivationRequestDeactivateItem[];
}
