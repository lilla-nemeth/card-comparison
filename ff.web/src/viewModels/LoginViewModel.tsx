import { action, computed, makeObservable, observable, runInAction } from "mobx";

import {
  BaseViewModel,
  BaseViewModelProps,
} from "@vuo/viewModels/BaseViewModel";
import {
  startAuthentication,
  startRegistration,
} from "@simplewebauthn/browser";
import {
  AuthenticationResponseJSON,
  PublicKeyCredentialRequestOptionsJSON,
  PublicKeyCredentialCreationOptionsJSON,
} from "@simplewebauthn/types";

import sessionDataStore from "@vuo/stores/SessionDataStore";
import TagManager from "react-gtm-module";
import { ChannelUser } from "@vuo/stores/WebSocketStore";

interface AuthenticationOptions {
  options: PublicKeyCredentialRequestOptionsJSON;
  uuid: string;
}

interface AuthenticationVerifiedJSON {
  status: string;
  token: string;
  user: ChannelUser;
}

export default class LoginViewModel extends BaseViewModel {
  private sessionDataStore = sessionDataStore;
  onboardingComplete: boolean;

  constructor() {
    super();
    this.onboardingComplete = localStorage.getItem("onboardingComplete") === "true";

    makeObservable(this, {
      ...BaseViewModelProps,
      onboardingComplete: observable,
      setIsOnboardingComplete: action,
      isOnboardingComplete: computed,
      session: computed,
      startAuthentication: action,
      registerUser: action,
    });
  }

  setIsOnboardingComplete(value: boolean): void {
    this.onboardingComplete = value;
    localStorage.setItem("onboardingComplete", String(value));
  }

  get isOnboardingComplete(): boolean {
    return this.onboardingComplete;
  }

  get session(): boolean {
    return !!this.sessionDataStore.token;
  }

  async startAuthentication(): Promise<void> {
    if (
      window.PublicKeyCredential &&
      PublicKeyCredential.isConditionalMediationAvailable
    ) {
      const isCMA = await PublicKeyCredential.isConditionalMediationAvailable();
      if (isCMA) {
        const authenticationOptionsResponse =
          await this.fetchData<AuthenticationOptions>({
            url: "v1/authenticate/generate-options",
          });

        if (authenticationOptionsResponse) {
          try {
            const asseResp: AuthenticationResponseJSON =
              await startAuthentication(authenticationOptionsResponse.options);
            const bodyPayload = {
              auth: asseResp,
              uuid: authenticationOptionsResponse.uuid,
            };
            const authenticateVerifyResponse =
              await this.fetchData<AuthenticationVerifiedJSON>({
                url: "v1/authenticate/verify",
                method: "POST",
                data: bodyPayload,
              });

            if (authenticateVerifyResponse) {
              runInAction(() => {
                sessionDataStore.token = authenticateVerifyResponse.token;
                sessionDataStore.user = authenticateVerifyResponse.user;
              })
            }
          } catch (error) {
            this.setErrors(
              error instanceof Error
                ? error
                : new Error("An unexpected error occurred"),
            );
          }
        } else {
          this.setErrors(new Error("failed to fetch auth options"));
        }
      }
    }
  }

  async registerUser(username: string, tpaId?: string): Promise<void> {
    const optionsResponse =
      await this.fetchData<PublicKeyCredentialCreationOptionsJSON>({
        url: "v1/register/generate-options",
        method: "POST",
        data: { username },
      });

    let attestation;
    try {
      attestation = await startRegistration(optionsResponse!);
    } catch (error) {
      this.setErrors(
        error instanceof Error
          ? error
          : new Error("Error with startRegistration"),
      );
    }

    const verificationResponse =
      await this.fetchData<AuthenticationVerifiedJSON>({
        url: "v1/register/verify",
        method: "POST",
        data: { username, attestation, tpaId },
      });

    TagManager.dataLayer({
      dataLayer: {
        event: "user_registered"
      },
    });

    sessionDataStore.token = verificationResponse?.token;
    sessionDataStore.user = verificationResponse?.user;
  }
}
