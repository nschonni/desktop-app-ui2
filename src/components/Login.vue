<template>
  <div class="login">
    <spinner :loading="isProcessing" />

    <div class="column">
      <div>
        <div class="centered" style="margin-top: -50px; margin-bottom:50px">
          <img src="@/assets/logo.svg" />
        </div>

        <div class="centered">
          <div class="large_text">Enter your Account ID</div>
          <div style="height: 12px" />
          <!--<div class="small_text">Enter your Account ID</div>-->
        </div>

        <div style="height: 21px" />

        <input
          class="styledBig"
          ref="accountid"
          style="text-align: center"
          placeholder="i-XXXX-... or ivpnXXXXXXXX"
          v-model="accountID"
          v-on:keyup="keyup($event)"
        />

        <div style="height: 24px" />
        <button class="master" v-on:click="Login">Log In</button>
        <div style="height: 12px" />
        <button class="slave" v-on:click="CreateAccount">
          Create an account
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import spinner from "@/components/controls/control-spinner.vue";
const sender = window.ipcSender;
import { API_SUCCESS, API_SESSION_LIMIT } from "@/api/statuscode";

export default {
  props: {
    forceLoginAccount: {
      type: String,
      default: null
    }
  },
  components: {
    spinner
  },
  data: function() {
    return {
      accountID: "",
      isProcessing: false
    };
  },
  mounted() {
    this.$refs.accountid.focus();

    if (this.$route.params.forceLoginAccount != null) {
      this.accountID = this.$route.params.forceLoginAccount;

      const force = true;
      this.Login(force);
    } else {
      if (this.$store.state.settings.isExpectedAccountToBeLoggedIn === true) {
        this.$store.dispatch("settings/isExpectedAccountToBeLoggedIn", false);
        setTimeout(() => {
          sender.showMessageBox({
            type: "info",
            buttons: ["OK"],
            message: `You are logged out.\n\nYou have been redirected to the login page to re-enter your credentials.`
          });
        }, 0);
      }
    }
  },
  methods: {
    async Login(isForceLogout) {
      try {
        // check accoundID
        var pattern = new RegExp("^(i-....-....-....)|(ivpn[a-zA-Z0-9]{7,8})$"); // fragment locator
        if (this.accountID) this.accountID = this.accountID.trim();
        if (pattern.test(this.accountID) !== true) {
          throw new Error(
            "Your account ID has to be in 'i-XXXX-XXXX-XXXX' or 'ivpnXXXXXXXX' format. You can find it on other devices where you are logged in and in the client area of the IVPN website."
          );
        }

        this.isProcessing = true;
        const resp = await sender.Login(this.accountID, isForceLogout === true);

        if (resp.APIStatus !== API_SUCCESS) {
          if (resp.APIStatus === API_SESSION_LIMIT && resp.Account != null) {
            this.$router.push({
              name: "AccountLimit",
              params: {
                accountID: this.accountID,
                devicesMaxLimit: resp.Account.Limit,
                CurrentPlan: resp.Account.CurrentPlan,
                Upgradable: resp.Account.Upgradable,
                UpgradeToPlan: resp.Account.UpgradeToPlan,
                UpgradeToURL: resp.Account.UpgradeToURL
              }
            });
          } else throw new Error(`[${resp.APIStatus}] ${resp.APIErrorMessage}`);
        } else {
          try {
            await sender.GeoLookup();
          } catch (e) {
            console.error(e);
          }
        }
      } catch (e) {
        console.error(e);
        sender.showMessageBoxSync({
          type: "error",
          buttons: ["OK"],
          message: "Failed to login",
          detail: `${e}`
        });
      } finally {
        this.isProcessing = false;
      }
    },
    CreateAccount() {
      sender.shellOpenExternal(`https://www.ivpn.net/signup`);
    },
    keyup(event) {
      if (event.keyCode === 13) {
        // Cancel the default action, if needed
        event.preventDefault();
        this.Login();
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.login {
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
}

.column {
  width: 100%;
  margin-left: 20px;
  margin-right: 20px;
}

.centered {
  margin-top: auto;
  margin-bottom: auto;
  text-align: center;
}

.large_text {
  font-weight: 600;
  font-size: 18px;
  line-height: 120%;
}

.small_text {
  font-size: 13px;
  line-height: 17px;
  letter-spacing: -0.208px;
  color: #98a5b3;
}
</style>
