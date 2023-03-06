<template>
  <div id="app" class="ma-0">
    <v-container>

      <!-- Set stocks card part -->
      <v-row>
        <ul>
          <li class="annotation">※ 対象銘柄の情報を登録してください</li>
        </ul>

        <v-data-table-virtual
          :headers="variableDialog.headers"
          :items="variableDialog.stocks"
          class="elevation-3"
        >
          <template v-slot:top>
            <v-toolbar flat color="white">

              <!-- dialog part -->
              <v-dialog
                v-model="dialog"
                scrollable
                max-width="650px"
              >
                <!-- add stock btn -->
                <template v-slot:activator="{ props }">
                  <v-btn
                    color="primary"
                    dark
                    class="mb-2"
                    elevation="5"
                    v-bind="props"
                  >
                    &nbsp;新規追加&nbsp;
                    <v-icon>
                      mdi-plus
                    </v-icon>
                  </v-btn>
                </template>

                <!-- stock card -->
                <v-form ref="form" v-model="valid" lazy-validation>
                  <v-card>
                    <v-card-title>
                      {{ formTitle }}
                    </v-card-title>

                    <!-- card contents -->
                    <v-card-text style="height: 400px;">
                      <v-container>
                        <v-row>
                          <!-- Name -->
                          <v-col cols="7">
                            <v-text-field
                              v-model="variableDialog.editedItem.name"
                              label="銘柄名"
                              placeholder="銘柄名を入力してください"
                              :rules="[rules.required, rules.max_6]"
                              :counter="6"
                            ></v-text-field>
                          </v-col>
                          <!-- NoTax -->
                          <v-col cols="5">
                            <v-checkbox
                              v-model="variableDialog.editedItem.noTax"
                              label="NISA"
                            ></v-checkbox>
                          </v-col>
                          <!-- Yield -->
                          <v-col cols="6" md="4">
                            <v-text-field
                              type="number"
                              step="0.01"
                              v-model="variableDialog.editedItem.yield"
                              label="年利"
                              :rules="[rules.required, rules.min_0_1_number, rules.max_300_number]"
                            ></v-text-field>
                          </v-col>
                          <!-- Dividend -->
                          <v-col cols="6" md="4">
                            <v-text-field
                              type="number"
                              step="0.01"
                              v-model="variableDialog.editedItem.dividend"
                              label="配当利回り"
                              :rules="[rules.required, rules.min_0_number, rules.max_100_number]"
                            ></v-text-field>
                          </v-col>
                          <!-- TotalYear -->
                          <v-col cols="6" md="4">
                            <v-text-field
                              type="number"
                              step="1"
                              v-model="variableDialog.editedItem.year"
                              label="積立年数"
                              :rules="[rules.required, rules.min_1_number, rules.max_20_number]"
                            ></v-text-field>
                          </v-col>
                          <!-- Reserved -->
                          <v-col cols="6" md="4">
                            <v-text-field
                              type="number"
                              step="100"
                              v-model="variableDialog.editedItem.reserved"
                              label="月々積立額"
                              :rules="[rules.required, rules.min_100_number, rules.max_10000000_number]"
                            ></v-text-field>
                          </v-col>
                          <!-- InitFund -->
                          <v-col cols="6" md="4">
                            <v-text-field
                              type="number"
                              step="100"
                              v-model="variableDialog.editedItem.initFund"
                              label="初期投資額"
                              :rules="[rules.required, rules.min_0_number, rules.max_10000000_number]"
                            ></v-text-field>
                          </v-col>
                          <!-- isJapan -->
                          <v-col cols="6" md="4">
                            <v-select
                              :items="['日本株', '米国株']"
                              v-model="variableDialog.editedItem.isJp"
                              label="日 or 米"
                              :rules="[rules.required]"
                            ></v-select>
                          </v-col>
                          <!-- Volatility -->
                          <v-col cols="12">
                            <v-slider
                              v-model="variableDialog.editedItem.volatility"
                              class="align-center"
                              color="brown"
                              :max="30"
                              :min="0"
                              :step="0.01"
                              :rules="[rules.required]"
                              hide-details
                            >
                              <template v-slot:append>
                                <v-text-field
                                  v-model="variableDialog.editedItem.volatility"
                                  hide-details
                                  single-line
                                  density="compact"
                                  type="number"
                                  label="1σボラ"
                                  style="width: 110px"
                                ></v-text-field>
                              </template>
                          </v-slider>
                          </v-col>
                          <!-- Note -->
                          <v-col cols="12">
                            <!-- isJapan and noTax -->
                            <div v-if="variableDialog.editedItem.isJp=='日本株' && variableDialog.editedItem.noTax">
                              <ul class="cp_list">
                                <li>キャピタルゲインにかかる税率：0%</li>
                                <li>インカムゲインにかかる税率：0%</li>
                                <li>NISAの非課税期間は無期限で計算</li>
                              </ul>
                            </div>
                            <!-- isJapan and hasTax -->
                            <div v-if="variableDialog.editedItem.isJp=='日本株' && variableDialog.editedItem.noTax==false">
                              <ul class="cp_list">
                                <li>キャピタルゲインにかかる税率：20.315%</li>
                                <li>インカムゲインにかかる税率：20.315%</li>
                                <li>NISAの非課税期間は無期限で計算</li>
                              </ul>
                            </div>
                            <!-- isUS and noTax -->
                            <div v-if="variableDialog.editedItem.isJp=='米国株' && variableDialog.editedItem.noTax">
                              <ul class="cp_list">
                                <li>キャピタルゲインにかかる税率：0%</li>
                                <li>インカムゲインにかかる税率：10%</li>
                                <li>NISAの非課税期間は無期限で計算</li>
                              </ul>
                            </div>
                            <!-- isUS and noTax -->
                            <div v-if="variableDialog.editedItem.isJp=='米国株' && variableDialog.editedItem.noTax==false">
                              <ul class="cp_list">
                                <li>キャピタルゲインにかかる税率：20.315%</li>
                                <li>インカムゲインにかかる税率：約28.213%</li>
                                <li class="alert">本シミュレーションは外国税配当控除を適用しないものとして計算</li>
                                <li>NISAの非課税期間は無期限で計算</li>
                              </ul>
                            </div>
                          </v-col>

                        </v-row>
                      </v-container>
                    </v-card-text>

                    <!-- card btns -->
                    <v-card-actions>
                      <v-btn class="my-0" @click="reset">クリア<v-icon>mdi-refresh</v-icon></v-btn>
                      <v-spacer></v-spacer>
                      <v-btn color="blue darken-1" variant="text" @click="save">保存</v-btn>
                      <v-btn color="blue darken-1" variant="text" @click="close">閉じる</v-btn>
                    </v-card-actions>

                  </v-card>
                </v-form>
              </v-dialog>

              <v-dialog v-model="dialogDelete" max-width="400px">
                <v-card>
                  <v-card-title>
                    <p class="v_card__delete_message">選択した銘柄を削除しますか？</p>
                  </v-card-title>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm">OK</v-btn>
                    <v-btn color="blue-darken-1" variant="text" @click="closeDelete">キャンセル</v-btn>
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-card>
              </v-dialog>

            </v-toolbar>
          </template>

          <template v-slot:[`item.noTax`]="{ item }">
            <v-checkbox-btn
              v-model="item.value.noTax"
              disabled
            ></v-checkbox-btn>
          </template>

          <!-- delete or edit btns -->
          <template v-slot:[`item.actions`]="{ item }">
            <v-icon
              size="small"
              class="mr-2"
              @click="editItem(item.raw)"
            >
              mdi-pencil
            </v-icon>
            <v-icon
              size="small"
              @click="deleteItem(item.raw)"
            >
              mdi-delete
            </v-icon>
          </template>

        </v-data-table-virtual>
      </v-row>

      <!-- Requests API part -->
      <v-row>
        <v-spacer></v-spacer>
        <v-btn class="v_btn__submit" elevation="5">
          <v-btn color="blue-darken-1" variant="text" @click="submit">計算開始</v-btn>
        </v-btn>
        <v-spacer></v-spacer>
      </v-row>
      <v-row>
        <br />
        <div v-if="isAlert" class="stock_alert">
          必ず1つ以上の銘柄を登録してください
        </div>
        <br />
      </v-row>

      <!-- Loading part -->
      <v-row>
        <v-col cols="12">
          <div class="text-center">
            <loading
              :active="isLoading"
              :is-full-page="fullPage"
              loader="dots"
              color="#3B8070"
              width="100"
              height="100"
            ></loading>
          </div>
        </v-col>
      </v-row>

      <!-- Charts part -->
      <div v-if="result">
        <v-card>
          <v-tabs
            v-model="tab"
            bg-color="transparent"
            color="basil"
            align-tabs="center"
            show-arrows
          >
            <v-tab value="one" class="v_tab">資産推移</v-tab>
            <v-tab value="two" class="v_tab">資産割合</v-tab>
            <v-tab value="three" class="v_tab">評価損益予想</v-tab>
            <v-tab value="four" class="v_tab">配当金</v-tab>
            <v-tab value="five" class="v_tab">取り崩し</v-tab>
          </v-tabs>

          <v-card-text>
            <v-window v-model="tab">

              <!-- TransitionChart -->
              <v-window-item value="one">
                <br />
                <p><span class="stripe result-price">最終資産額 &nbsp;&nbsp;<span class="red">{{ totalPrice.toLocaleString() }}</span> &nbsp;万円</span></p>
                <br />
                <p><span class="stripe result-price">元本金額 &nbsp;&nbsp;<span class="red">{{ capitalPrice.toLocaleString() }}</span> &nbsp;万円</span></p>
                <br />
                <TransitionChart
                  v-if="result"
                  :max_year="chartOptions.transitionOptions.max_year"
                  :capitalPriceTransition="chartOptions.transitionOptions.capitalPriceTransition"
                  :priceTransition="chartOptions.transitionOptions.priceTransition"
                  :chartHeight="chartHeight"
                ></TransitionChart>
                <ul>
                  <li class="addendum">※ 配当金は再投資しないことを想定しているので<span class="red">考慮対象外</span></li> <br />
                  <li class="addendum">※ 利確前を想定しているので税金についても<span class="red">考慮対象外</span></li> <br />
                  <li class="addendum">※ 平均を算出しているのでボラティリティについても<span class="red">考慮対象外</span></li> <br />
                </ul>
              </v-window-item>

              <!-- PieChart -->
              <v-window-item value="two">
                <v-row>
                  <v-col cols="12" sm="6">
                    <h3>税引き前</h3>
                    <PieChart
                      v-if="result"
                      :data="chartOptions.pieOptions1.data"
                      :chartHeight="chartHeight"
                    ></PieChart>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <h3>税引き後</h3>
                    <PieChart
                      v-if="result"
                      :data="chartOptions.pieOptions2.data"
                      :chartHeight="chartHeight"
                    ></PieChart>
                  </v-col>
                  <v-col cols="12">
                    <ul>
                      <li class="addendum">※ 配当金は再投資しないことを想定しているので<span class="red">考慮対象外</span></li> <br />
                      <li class="addendum">※ 税金は<span class="blue">考慮対象</span></li> <br />
                      <li class="addendum">※ 平均を算出しているのでボラティリティについては<span class="red">考慮対象外</span></li> <br />
                    </ul>
                  </v-col>
                </v-row>
              </v-window-item>

              <!-- DensityPlot and Table -->
              <v-window-item value="three">
                <DensityPlot
                  v-if="result"
                  :data="chartOptions.densityOptions.data"
                  :chartHeight="chartHeight"
                ></DensityPlot>
                <ul>
                  <li class="addendum">※ 配当金は再投資しないことを想定しているので<span class="red">考慮対象外</span></li> <br />
                  <li class="addendum">※ 利確前を想定しているので税金についても<span class="red">考慮対象外</span></li> <br />
                  <li class="addendum">※ ボラティリティは<span class="blue">考慮対象</span></li> <br />
                </ul>
              </v-window-item>

              <!-- BarChart -->
              <v-window-item value="four">
                <BarChart
                  v-if="result"
                  :tax="chartOptions.barOptions.tax"
                  :price="chartOptions.barOptions.price"
                  :chartHeight="chartHeight"
                ></BarChart>
                <ul>
                  <li class="addendum">※ 配当金は<span class="blue">考慮対象</span></li> <br />
                  <li class="addendum">※ 配当金にかかる税金について<span class="blue">考慮対象</span></li> <br />
                  <li class="addendum">※ ボラティリティは<span class="red">考慮対象外</span></li> <br />
                </ul>
              </v-window-item>

              <!-- DemolitionChart -->
              <v-window-item value="five">
                <v-row>
                  <v-spacer></v-spacer>
                  <!-- <v-spacer></v-spacer> -->
                  <v-col cols="12" md="4">
                    <v-text-field
                      type="number"
                      step="1"
                      v-model="reSubmitYear"
                      label="積立年数（年）"
                      :rules="[rules.required, rules.min_1_number, rules.max_20_number]"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="2">
                    <v-btn class="v_btn_re_submit" elevation="5">
                      <v-btn color="blue-darken-1" variant="text" @click="reSubmit">再計算</v-btn>
                    </v-btn>
                  </v-col>
                </v-row>
                <br />
                <p><span class="stripe result-price">1年間の取り崩し可能額 &nbsp;&nbsp;<span class="red">{{ demolitionPrice.toLocaleString() }}</span> &nbsp;万円</span></p>
                <br />
                <DemolitionChart
                  v-if="result"
                  :duration="chartOptions.demolitionOptions.duration"
                  :priceTransition="chartOptions.demolitionOptions.priceTransition"
                  :chartHeight="chartHeight"
                ></DemolitionChart>
                <ul>
                  <li class="addendum">※ 配当金は<span class="blue">考慮対象</span></li> <br />
                  <li class="addendum">※ 税金についてはキャピタルゲイン・インカムゲインともに<span class="red">考慮対象外</span></li> <br />
                  <li class="addendum">※ ボラティリティも<span class="red">考慮対象外</span></li> <br />
                </ul>
              </v-window-item>

            </v-window>
          </v-card-text>

        </v-card>

        <br />
        <br />

        <div class="scroll_table">
          <table v-if="result" class="event_table">
            <thead>
              <tr>
                <th>銘柄</th>
                <th>元本</th>
                <th>上位10%</th>
                <th>上位30%</th>
                <th>下位30%</th>
                <th>下位10%</th>
                <th>元本割れ確率 (%)</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in chartOptions.densityOptions.tableRows" :key="row.name">
                <td>{{ row.name }}</td>
                <td>{{ row.originPrice }} 万円</td>
                <td>{{ row.top10 }} 万円</td>
                <td>{{ row.top30 }} 万円</td>
                <td>{{ row.worst30 }} 万円</td>
                <td>{{ row.worst10 }} 万円</td>
                <td class="red">{{ row.prob }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <ul>
          <li class="addendum">※ 配当・税・ボラティリティは評価損益予想と同じ定義</li> <br />
        </ul>
      </div>

    </v-container>
  </div>

</template>

<script>
import axios from 'axios'
import Loading from 'vue3-loading-overlay'
import 'vue3-loading-overlay/dist/vue3-loading-overlay.css'
import TransitionChart from './chart/TransitionChart'
import PieChart from './chart/PieChart'
import BarChart from './chart/BarChart'
import DensityPlot from './chart/DensityPlot'
import DemolitionChart from './chart/DemolitionChart'

export default {
  name: 'HomePage',

  components: {
    Loading,
    TransitionChart,
    PieChart,
    BarChart,
    DensityPlot,
    DemolitionChart,
  },

  data () {
    return {
      // Resposive
      windowWidth: '',
      chartHeight: 450,

      // Alert (number of stocks)
      isAlert: false,

      // Response Data
      result: null,
      capitalPrice: null,
      totalPrice: null,
      demolitionPrice: null,

      // Loading
      isLoading: false,
      fullPage: true,

      // Tab
      tab: null,

      // Valiables for Dialog
      dialog: false,
      dialogDelete: false,
      variableDialog: {
        headers: [
          {
            title: '',
            align: 'start',
            sortable: false,
            key: 'name',
            width: 140,
          },
          { title: '年利 %', key: 'yield', width: 110 },
          { title: '配当 %', key: 'dividend', width: 110 },
          { title: '年数', key: 'year', width: 90 },
          { title: '月々 ¥', key: 'reserved', width: 110 },
          { title: '初期 ¥', key: 'initFund', width: 110 },
          { title: '区分', key: 'isJp', width: 90 },
          { title: 'ボラ %', key: 'volatility', width: 110},
          { title: 'NISA', key: 'noTax', width: 60 },
          { title: '', key: 'actions', sortable: false, width: 90 },
        ],
        stocks: [],
        editedIndex: -1,
        editedItem: {
          name: null,
          yield: null,
          dividend: null,
          year: null,
          reserved: null,
          initFund: null,
          isJp: null,
          volatility: null,
          noTax: false,
        },
        defaultItem: {
          name: null,
          yield: null,
          dividend: null,
          year: null,
          reserved: null,
          initFund: null,
          isJp: null,
          volatility: null,
          noTax: false,
        },
      },

      // Re Submit
      reSubmitYear: 20,

      // Functions and Variables for Input Validation
      valid: true,
      rules: {
        required: value => !!value || '必須項目です。',
        min_0_number: value => value >= 0 || '0以上の値を入力してください。',
        min_0_1_number: value => value >= 0.1 || '0.1以上の値を入力してください。',
        min_1_number: value => value >= 1 || '1以上の値を入力してください。',
        min_100_number: value => value >= 100 || '100以上の値を入力してください。',
        max_20_number: value => value <= 20 || '20以下の値を入力してください。',
        max_100_number: value => value <= 100 || '100以下の値を入力してください。',
        max_300_number: value => value <= 300 || '300以下の値を入力してください。',
        max_10000000_number: value => value <= 10000000 || '10000000以下の値を入力してください。',
        max_6: value => value.length <= 6 || '6文字以内で入力してください。',
      },

      // Chart & Table Data
      chartOptions: {
        // Transition Chart Data
        transitionOptions: {
          max_year: null,
          capitalPriceTransition: [],
          priceTransition: [],
        },

        // Pie Chart Data
        pieOptions1: {
          data: []
        },
        pieOptions2: {
          data: []
        },

        // Density Plot Data
        densityOptions: {
          data: [],
          tableRows: [],
        },

        // Bar Chart Data
        barOptions: {
          'tax': [],
          'price': [],
        },

        // Demolition Chart Data
        demolitionOptions: {
          max_year: null,
          startAssetDemolition: [],
          addAssetDemolition: [],
        }
      }
    }
  },

  mounted () {
    window.addEventListener('load', this.resizeWindow)
    window.addEventListener('resize', this.resizeWindow)
  },

  computed: {
    formTitle () {
      return this.variableDialog.editedIndex === -1 ? '新規銘柄の追加' : '銘柄情報の編集'
    },
  },

  watch: {
    dialog (val) {
      val || this.close()
    },
    dialogDelete (val) {
      val || this.closeDelete()
    },
  },

  created () {
    this.initialize()
  },

  methods: {
    resizeWindow () {
      this.windowWidth = window.innerWidth
      this.chartHeight = this.windowWidth > 600 ? 450 : 250
    },

    initialize () {
      this.variableDialog.stocks = []
    },

    editItem (item) {
      this.variableDialog.editedIndex = this.variableDialog.stocks.indexOf(item)
      this.variableDialog.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item) {
      this.variableDialog.editedIndex = this.variableDialog.stocks.indexOf(item)
      this.variableDialog.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm () {
      this.variableDialog.stocks.splice(this.variableDialog.editedIndex, 1)
      this.closeDelete()
    },

    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.variableDialog.editedItem = Object.assign({}, this.variableDialog.defaultItem)
        this.variableDialog.editedIndex = -1
      })
    },

    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.variableDialog.editedItem = Object.assign({}, this.variableDialog.defaultItem)
        this.variableDialog.editedIndex = -1
      })
    },

    async save () {
      const { valid } = await this.$refs.form.validate()
      if (valid) {
        if (this.variableDialog.editedIndex > -1) {
          Object.assign(this.variableDialog.stocks[this.variableDialog.editedIndex], this.variableDialog.editedItem)
        } else {
          this.variableDialog.stocks.push(this.variableDialog.editedItem)
        }
        this.close()
        this.$refs.form.resetValidation()
      }
    },

    reset () {
      this.$refs.form.reset()
    },

    submit () {
      if (this.variableDialog.stocks.length == 0) {
        this.isAlert = true
      } else {
        this.isAlert = false
        this.isLoading = true
        this.result = null
        let params = {}
        this.variableDialog.stocks.forEach(stock => {
          params[stock.name] = `${stock.yield},` +
                                `${stock.dividend},` +
                                `${stock.year},` +
                                `${stock.reserved},` +
                                `${stock.initFund},` +
                                `${stock.isJp =='日本株' ? 1 : 0},` +
                                `${stock.volatility},` +
                                `${Number(stock.noTax)}`
        })
        const url = `${import.meta.env.VITE_BACKEND_URL}/calculation`
        const configData = {
          method: 'GET',
          url: url,
          headers: {
            'Content-Type': 'text/plain;charset=utf-8'
          },
          params: params
        }
        axios(configData)
          .then(res => {
            // All Results
            this.result = res.data
            // Chart Data
            let transitionData = this.result.transition
            let pieData = this.result.pie
            let barData = this.result.bar
            let densityData = this.result.density
            let demolitionData = this.result.demolition

            // Transition Options
            this.capitalPrice = Math.floor(transitionData.capitalPriceTransition.slice(-1)[0] / 10000)
            this.totalPrice = Math.floor(transitionData.priceTransition.slice(-1)[0] / 10000)
            this.chartOptions.transitionOptions.max_year = transitionData.max_year
            this.chartOptions.transitionOptions.capitalPriceTransition = transitionData.capitalPriceTransition
            this.chartOptions.transitionOptions.priceTransition = transitionData.priceTransition

            // Pie Options1
            this.chartOptions.pieOptions1.data = pieData.notTax
            // Pie Options2
            this.chartOptions.pieOptions2.data = pieData.hasTax

            // Bar Options
            this.chartOptions.barOptions.tax = barData.tax
            this.chartOptions.barOptions.price = barData.price

            // Density Options
            this.chartOptions.densityOptions.data = densityData.data
            this.chartOptions.densityOptions.tableRows = densityData.tableRows

            // Demolition Options
            this.demolitionPrice = demolitionData.demolitionPrice
            this.chartOptions.demolitionOptions.duration = demolitionData.duration
            this.chartOptions.demolitionOptions.priceTransition = demolitionData.priceTransition

            // Loading
            this.isLoading = false
          })
          .catch(err => {
            console.log(err)
            this.isLoading = false
          })
      }
    },

    reSubmit () {
      // this.isLoading = true
      this.result = null
      let params = {}
      this.variableDialog.stocks.forEach(stock => {
        params[stock.name] = `${stock.yield},` +
                              `${stock.dividend},` +
                              `${stock.year},` +
                              `${stock.reserved},` +
                              `${stock.initFund},` +
                              `${stock.isJp =='日本株' ? 1 : 0},` +
                              `${stock.volatility},` +
                              `${Number(stock.noTax)}`
      })
      params['reSubmitYear'] = this.reSubmitYear
      const url = `${import.meta.env.VITE_BACKEND_URL}/re-calculation`
      const configData = {
        method: 'GET',
        url: url,
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        params: params
      }
      axios(configData)
        .then(res => {
          // All Results
          this.result = res.data
          // Chart Data
          let demolitionData = this.result.demolition
          // Demolition Options
          this.demolitionPrice = demolitionData.demolitionPrice
          this.chartOptions.demolitionOptions.duration = demolitionData.duration
          this.chartOptions.demolitionOptions.priceTransition = demolitionData.priceTransition

          // Loading
          // this.isLoading = false
        })
        .catch(err => {
          console.log(err)
          // this.isLoading = false
        })
    }
  }
}
</script>

<style scoped>
h2 {
  margin-top: 3.5em;
  margin-bottom: 1.0em;
}
h3 {
  margin-top: 1em;
  margin-bottom: 0em;
}

p {
  text-align: left;
  font-size: 1.3em;
}

ul {
  background-color: white;
  text-align: left;
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
li.annotation {
  margin-bottom: 1em;
}

a {
  color: #42b983;
}

table{
  border-collapse:separate;
  border-spacing: 5px;
  table-layout: fixed;
  min-width: 100%;
}
table th,table td{
  border-radius: 5px;
  text-align: center;
  padding: 12px 3px;
  width: 500px;
  min-width: 80px;
}
table th{
  background-color: #dacab2;
  color: rgb(28, 1, 1);
  border:solid 1px #927141;
}
table td{
  background-color: #edebe7;
  border:solid 1px #af9d85;
}
.scroll_table table {
  margin: 0 auto;
  display: block;
  overflow-x: scroll;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
}
.event_table tr:hover td {
  background-color: #f5f5f5;
}

ul.cp_list {
  padding: 0em;
  list-style: none;
  font-size: medium;
}
ul.cp_list li {
  position: relative;
  padding: 0.5em 1em 0.5em 2.3em;
  margin-bottom: 5px;
  /* border-bottom: 1px solid rgba(255, 143, 0, 1); */
  list-style: none;
}
ul.cp_list li:after,
ul.cp_list li:before {
  content:'';
  position: absolute;
  transform: rotate(45deg);
}
ul.cp_list li:before {
  top: 0.7em;
  left: 0em;
  width: 12px;
  height: 12px;
  border:2px solid rgba(255, 81, 0, 0.993);
}
ul.cp_list li:after {
  top: 0.9em;
  left: 0.5em;
  width: 14px;
  height: 14px;
  background: rgba(255, 81, 0, 0.26);
  transform: rotate(60deg);
}
li.alert {
  color: #ff0000;
}

.stripe{
  position: relative;
  padding: 0.3em;
}
.stripe:after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 7px;
  background: repeating-linear-gradient(-45deg, rgb(157, 222, 248), skyblue 2px, white 2px, white 4px);
}

.stock_alert {
  color: #ff0000;
  margin: 0 auto;
}

.result-price {
  font-size: clamp(15px, 2.5vw, 26px);
}
.addendum {
  margin-top: 0.3em;
  margin-bottom: 0.3em;
  font-size: clamp(11px, 2.5vw, 18px);
}
.red {
  color: #a31919;
}
.blue {
  color: #3f3fe6;
}

.v_card__delete_message {
  text-align: center;
  font-size: 0.8em;
}
.v_btn__submit {
  margin-top: 4.5em;
  margin-bottom: 2em;
}
.v_btn_re_submit {
  margin-top: 1em;
  margin-bottom: 2em;
}
.v_tab {
  font-size: clamp(11px, 2.5vw, 20px);
}
.bg-basil {
  background-color: #FFFBE6 !important;
}
.text-basil {
  color: #356859 !important;
}
</style>
