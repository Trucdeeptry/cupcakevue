<template>
  <div>
    <div class="py-4">
      <div class="mx-auto max-w-screen-xl">
        <data-table
          v-model:expandedRows="expandedRows"
          dataKey="_id"
          responsive="true"
          sortable
          v-model:editingRows="editingRows"
          editMode="row"
          paginator
          :rows="selectedRow"
          :value="searchProduct"
          @row-edit-save="onRowEditSave"
          responsiveLayout="scroll"
        >
          <template #header>
            <div class="flex items-center justify-between">
              <IconField>
                <InputIcon>
                  <i class="pi pi-search" />
                </InputIcon>
                <InputText
                  class="w-96"
                  v-model="searchQuery"
                  :placeholder="`Keyword Search, Ví dụ: ` + searchTarget"
                />
                <Dropdown
                  class="ml-5"
                  v-model="selectedRow"
                  :options="optionsRow"
                  checkmark
                  placeholder="Display row"
                ></Dropdown>
              </IconField>
              <Button
                v-if="isAdmin"
                @click="$store.dispatch('setModal', true)"
                label="New"
                icon="pi pi-plus"
                class="mr-2"
              />
            </div>
          </template>
          <column expander v-if="currentStore == 'order'"></column>
          <column
            sortable
            v-for="item in renamedKey(data)"
            :key="item"
            :field="reversedKey()[item]"
            :header="item"
            :headerStyle="{
              whiteSpace: 'nowrap',
              color: 'white',
            }"
            :class="hiddenColumn"
          >
            <template #body="slotProps">
              <p
                class="text-ellipsis overflow-hidden whitespace-nowrap max-w-44"
              >
                {{ formatDate(slotProps.data[reversedKey()[item]]) }}
              </p>
            </template>

            <template #editor="{ data, field }">
              <InputText v-model="data[field]"></InputText>
            </template>
          </column>
          <Column v-if="this.currentStore == 'order' && isAdmin">
            <template #body="slotProps">
              <Button
                v-show="slotProps.data.trang_thai != 'Đã giao'"
                outlined
                rounded
                @click="checkDone(slotProps.data)"
                icon="pi pi-check-circle"
              >
              </Button>
            </template>
          </Column>
          <column v-if="isAdmin" :rowEditor="true"> </column>
          <column v-if="isAdmin">
            <template #body="slotProps">
              <Button
                @click="deleteItem(slotProps.data)"
                icon="pi pi-trash"
                outlined
                severity="danger"
                rounded
              >
              </Button>
            </template>
          </column>

          <template #expansion="slotProps" v-if="currentStore == 'order'">
            <div class="p-2" v-if="slotProps.data.details.length != 0">
              <DataTable
                v-model:editingRows="editingDetailRows"
                editMode="row"
                paginator
                :rows="3"
                @row-edit-save="onRowEditDetailSave"
                responsiveLayout="scroll"
                reponsive="true"
                :value="slotProps.data.details"
              >
                <column
                  sortable
                  :class="childClass"
                  v-for="item in renamedKey(slotProps.data.details)"
                  :key="item"
                  :field="reversedKey()[item]"
                  :header="item"
                >
                  <template #body="slotProps">
                    <span v-if="item === 'Tên sản phẩm'">
                      {{ getProductName(slotProps.data.ma_sp) }}
                    </span>
                    <span v-else>
                      {{ slotProps.data[reversedKey()[item]] }}
                    </span>
                  </template>
                  <template v-if="isAdmin" #editor="{ data, field }">
                    <InputText v-model="data[field]"></InputText>
                  </template>
                </column>
                <column v-if="isAdmin" :rowEditor="true"> </column>
                <column v-if="isAdmin">
                  <template #body="slotProps">
                    <Button
                      @click="deleteDetailItem(slotProps.data)"
                      icon="pi pi-trash"
                      outlined
                      severity="danger"
                      rounded
                    >
                    </Button>
                  </template>
                </column>
              </DataTable>
            </div>
          </template>
        </data-table>
      </div>
    </div>
    <base-modal title="Nhập thông tin" width="550px" v-if="isAdmin">
      <div class="p-6">
        <form @submit.prevent ref="form">
          <base-button
            class="text-sm !p-4 rounded-xl"
            type="button"
            @click="storageInfo = {}"
            >Reset</base-button
          >
          <div class="grid grid-cols-2 gap-4 my-9">
            <div
              v-for="(item, index) in renamedKey(data)"
              :key="item"
              class="flex flex-col"
            >
              <div v-if="index > 1">
                <label
                  class="block mb-2 text-sm text-gray-900 font-bold w-1/2 text-nowrap"
                  for=""
                  >{{ item }}</label
                >
                <input
                  v-if="!reversedKey()[item].includes('ma_')"
                  required
                  v-model="storageInfo[reversedKey()[item]]"
                  :type="
                    numberKey.includes(reversedKey()[item]) ? 'number' : 'text'
                  "
                  :placeholder="'Nhập ' + reversedKey()[item]"
                  class="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500"
                />

                <Dropdown
                  v-else
                  :options="getForeignArray(reversedKey()[item])"
                  optionLabel="name"
                  optionValue="value"
                  checkmark
                  :placeholder="item"
                  v-model="storageInfo[reversedKey()[item]]"
                  class="w-full"
                ></Dropdown>
              </div>
            </div>
          </div>
          <base-button class="p-1" type="submit" @click="submitForm"
            >Thêm</base-button
          >
        </form>
      </div>
    </base-modal>
  </div>
</template>

<script>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { InputText } from 'primevue';
import { InputIcon } from 'primevue';
import { IconField } from 'primevue';
import { Dropdown } from 'primevue';
import { Button } from 'primevue';
import baseModal from '../../base/baseModal.vue';
import baseButton from '../../base/baseButton.vue';
export default {
  components: {
    DataTable,
    Column,
    InputText,
    InputIcon,
    IconField,
    Dropdown,
    Button,
    baseModal,
    baseButton,
  },
  props: {
    propData: {
      type: Array,
      required: true,
    },
    hiddenColumn: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
    },
    childClass: {
      type: String,
    },
  },
  data() {
    return {
      data: [],
      keyMapping: {
        _id: 'ID',
        quantity: null,
        ma_sp: 'Mã sản phẩm',
        ten_sp: 'Tên sản phẩm',
        gia: 'Giá',
        so_luong: 'Số lượng',
        ngay_sx: 'Ngày sản xuất',
        ngay_nhap: 'Ngày nhập',
        ngay_hh: 'Ngày hết hạn',
        ma_dm: 'Mã danh mục',
        ma_ncc: 'Mã nhà cung cấp',
        mo_ta: 'Mô tả',
        img: 'Đường dẫn',
        ma_dh: 'Mã đơn hàng',
        ngay_dat_hang: 'Ngày đặt hàng',
        tong_tien: 'Tổng tiền',
        trang_thai: 'Trạng thái',
        ghi_chu: 'Ghi chú',
        ma_kh: 'Mã khách hàng',
        ten_kh: 'Tên khách hàng',
        so_dien_thoai: 'Số điện thoại',
        dia_chi: 'Địa chỉ',
        ngay_sinh: 'Ngày sinh',
        ma_role: 'Mã role',
        mat_khau: 'Mật khẩu',
        ten_dm: 'Tên danh mục',
        ten_ncc: 'Tên nhà cung cấp',
        ten_nv: 'Tên nhân viên',
        ma_nv: 'Mã nhân viên',
        gioi_tinh: 'Giới tính',
        chiet_khau: 'Chiết khấu',
        don_gia: 'Đơn giá',
        thanh_tien: 'Thành tiền',
      },
      numberKey: [
        'so_luong',
        'tong_tien',
        'so_dien_thoai',
        'gia',
        'don_gia',
        'thanh_tien',
        'chiet_khau',
      ],
      selectedItem: '',
      dropDownOpenID: '',
      storageInfo: '',
      categoryMap: {
        DM01: 'Valentines Day',
        DM02: 'Happy Birthday',
        DM03: 'Easter',
        DM04: 'Mothers Day',
      },
      searchQuery: '',
      selectedFilter: [],
      searchTarget: '',
      selectedRow: 5,
      optionsRow: [5, 10, 15, 20],
      editingRows: [],
      editingDetailRows: [],
      expandedRows: {},
    };
  },
  computed: {
    currentStore() {
      const key = Object.keys(this.data[0]);
      const keyStoreMap = {
        ten_sp: 'products',
        ten_kh: 'account',
        ten_dm: 'events',
        ten_ncc: 'suplier',
        ten_nv: 'employee',
        ghi_chu: 'order',
      };
      const matchedKey = key.find((x) => keyStoreMap[x]);

      return matchedKey ? keyStoreMap[matchedKey] : null;
    },
    filterTable() {
      // const keys = Object.keys(this.data);
      return this.data.map((item) => {
        const filteredItem = { ...item };
        delete filteredItem.quantity;

        return filteredItem;
      });
    },
    selectedItemCom() {
      return this.selectedItem;
    },
    searchProduct() {
      if (!this.searchQuery) {
        return this.filterTable;
      }
      return this.filterTable.filter((product) => {
        const search =
          product.ten_sp ||
          product.ten_kh ||
          product.ten_dm ||
          product.ten_ncc ||
          product.ten_nv ||
          product.ghi_chu;
        return search.toLowerCase().includes(this.searchQuery.toLowerCase());
      });
    },
    productCategory() {
      const Category = this.data.map((x) => {
        return x.ma_dm || x.ma_role || x.trang_thai || x.ma_sp;
      });
      if (this.data[0].ma_dm) {
        return Category.map((x) => {
          return this.categoryMap[x];
        });
      }
      return Category;
    },
    CategoryFilter() {
      return this.countCategory(this.productCategory);
    },
    FilterProduct() {
      var key = Object.entries(this.categoryMap)
        .filter(([, value]) => this.selectedFilter.includes(value))
        .map(([key]) => key);

      return this.selectedFilter.length == 0
        ? this.searchProduct
        : key.length != 0
        ? this.searchProduct.filter((x) =>
            key.includes(x.ma_dm || x.ma_role || x.trang_thai || x.ma_sp)
          )
        : this.searchProduct.filter((x) =>
            this.selectedFilter.includes(
              x.ma_dm || x.ma_role || x.trang_thai || x.ma_sp
            )
          );
    },
    ForeignArrays() {
      const init = {};
      const ActionsMaps = {
        ma_kh: () => this.$store.getters['account/account'],
        ma_ncc: () => this.$store.getters['suplier/suplier'],
        ma_dm: () => this.$store.getters['events/events'],
        ma_role: () => this.$store.getters['roles/roles'],
        ma_dh: () => this.$store.getters['order/order'],
        ma_sp: () => this.$store.getters['products/productsRaw'],
      };
      const key = Object.keys(this.data[0]).filter((x) => x.includes('ma_'));      
      for (let index = 1; index < key.length; index++) {
        const action = ActionsMaps[key[index]]();
        const dropBoxArray = [];
        console.log(action);
        
        action.forEach((item) => {
          if (item.ten_dm) {
            dropBoxArray.push({
              value: item.ma_dm,
              name: item.ten_dm,
            });
          } else if (item.ten_kh) {
            dropBoxArray.push({
              value: item.ma_kh,
              name: item.ten_kh,
            });
          } else if (item.ten_ncc) {
            dropBoxArray.push({
              value: item.ma_ncc,
              name: item.ten_ncc,
            });
          } else if (item.ten_role) {
            dropBoxArray.push({
              value: item.ma_role,
              name: item.ten_role,
            });
          } else if (item.ma_dh) {
            dropBoxArray.push({
              value: item.ma_dh,
              name: item.ma_dh,
            });
          } else if (item.ten_sp) {
            dropBoxArray.push({
              value: item.ma_sp,
              name: item.ten_sp,
            });
          }
        });        
        init[key[index]] = dropBoxArray;
        
      }
      return init;
    },
    checkProp() {
      return this.hiddenColumn;
    },
  },
  watch: {
    propData(newValue) {
      this.data = newValue;
    },
  },
  methods: {
    reversedKey() {
      return Object.entries(this.keyMapping).reduce((acc, [key, value]) => {
        if (value !== null) acc[value] = key;
        return acc;
      }, {});
    },
    renamedKey(data) {
      const headingTable = Object.keys(data[0])
        .map((key) => {
          if (key == 'ma_sp') key = 'ten_sp';
          return this.keyMapping[key];
        })
        .filter((item) => item !== null && item !== undefined);
      return headingTable;
    },
    formatDate(value) {
      if (
        typeof value === 'string' &&
        (value.includes('-') || value.includes('/')) &&
        !isNaN(Date.parse(value))
      ) {
        const parsedDate = new Date(value);
        return parsedDate.toLocaleDateString('vi-VN');
      }
      return value;
    },
    countCategory(CategoryName) {
      var countObj = {};
      CategoryName.forEach((x) => {
        countObj[x] = (countObj[x] || 0) + 1;
      });
      return countObj;
    },
    submitForm() {
      const form = this.$refs.form;
      if (form.checkValidity()) {
        const keyMa = Object.keys(this.storageInfo)[0];
        this.storageInfo[keyMa] = Math.random().toString(36).substr(2, 9);
        this.$store.dispatch(`${this.currentStore}/addItem`, this.storageInfo);
        this.$store.dispatch('setModal', false);
      }
    },
    onRowEditSave(event) {
      let { newData } = event;

      this.$store.dispatch(`${this.currentStore}/updateItem`, newData);
    },
    onRowEditDetailSave(event) {
      let { newData } = event;

      this.$store.dispatch(`order/updateDetailItem`, newData);
    },
    deleteItem(data) {
      console.log(data);

      this.$store.dispatch(`${this.currentStore}/deleteItem`, data._id);
    },
    deleteDetailItem(data) {
      this.$store.dispatch(`order/deleteDetailItem`, data._id);
    },
    getForeignArray(item) {
      const key = item.toLowerCase();
      console.log(this.ForeignArrays);
      
      return this.ForeignArrays[key] || [];
    },
    checkDone(item) {
      const updatedStatus = { ...item, trang_thai: 'Đã giao' };
      console.log(updatedStatus);
      this.$store.dispatch(`order/updateItem`, updatedStatus);
    },
    getProductName(ma_sp) {
    const product = this.$store.getters['products/getProduct'](ma_sp);
    
    return product ? product.name : 'Unknown Product';
  },
  },

  created() {
    this.data = this.propData;

    this.storageInfo = Object.keys(this.data[0]).reduce((acc, key) => {
      if (key !== '_id' && key !== 'quantity') {
        acc[key] = null;
      }
      return acc;
    }, {});
    this.searchTarget =
      this.data[0].ten_sp ||
      this.data[0].ten_kh ||
      this.data[0].ten_dm ||
      this.data[0].ten_ncc ||
      this.data[0].ten_nv ||
      this.data[0].ghi_chu;
  },
};
</script>

<style>
.p-datatable-column-sorted {
  background: black !important;
}
.hidden-column1:nth-child(1) {
  display: none;
}
.hidden-column2:nth-child(2) {
  display: none;
}
.hidden-column3:nth-child(3) {
  display: none;
}
.hidden-column4:nth-child(4) {
  display: none;
}
.hidden-column5:nth-child(5) {
  display: none;
}
.hidden-column6:nth-child(6) {
  display: none;
}
.hidden-column7:nth-child(7) {
  display: none;
}
.hidden-column8:nth-child(8) {
  display: none;
}
.hidden-column9:nth-child(9) {
  display: none;
}
.hidden-column10:nth-child(10) {
  display: none;
}
</style>
