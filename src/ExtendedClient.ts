
import { HumanloopClient as BaseHumanloopClient } from "Client";
import { Evaluations as BaseEvaluations} from "api/resources/evaluations/client/Client";

class ExtendedEvaluations extends BaseEvaluations {
  constructor(options: BaseHumanloopClient.Options) {
    super(options); // Pass options to the parent Evaluations constructor.
  }
  // TODO: add new methods here
  run(): void {
    console.log("Running extended evaluation...");
  }
}

// Extend the main HumanloopClient to use the new `ExtendedEvaluations`.
export class HumanloopClient extends BaseHumanloopClient {
  protected _evaluations: ExtendedEvaluations | undefined;
  
  constructor(protected readonly _options: BaseHumanloopClient.Options) {
    super(_options);
  }

  public get evaluations(): ExtendedEvaluations {
    return (this._evaluations ??= new ExtendedEvaluations(this._options));
  }
}
