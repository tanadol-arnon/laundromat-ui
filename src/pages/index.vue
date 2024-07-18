<template>
  <v-container>
    <v-row>
      <v-col
        v-for="(item, index) in wachingMachines"
        :key="index"
        class="d-flex align-self-center"
      >
        <v-card
          class="mx-auto py-16 px-16"
          width="500"
          rounded="xl"
          @click="payment(item?._id)"
        >
          <v-card-title class="d-flex flex-column ga-5 justify-center">
            <div class="text-center">
              <p class="mx-auto text-h4 text-secondary font-weight-bold">
                {{ item?.name }}
              </p>
              <p
                class="mx-auto text-h6 font-weight-bold mt-5"
                :class="item?.active ? 'text-success' : 'text-warning'"
              >
                {{ item?.active ? "🟢 พร้อมใช้งาน" : "🟠 กำลังใช้งาน" }}
              </p>
            </div>
          </v-card-title>
        </v-card>
      </v-col>

      <v-dialog v-model="active" width="500px">
        <v-card max-width="500" title="ชำระเงิน">
          <template v-slot:default>
            <v-container>
              <v-row>
                <v-col>
                  <p class="mb-3">เลือกจำนวนเงินที่ต้องการชำระ</p>
                  <p class="mb-0 font-weight-bold">*หมายเหตุ</p>
                  <div class="ms-3 mb-5">
                    <p class="mb-0">10 บาท = 1.20 นาที</p>
                    <p class="mb-0">20 บาท = 1.30 นาที</p>
                    <p class="mb-0">40 บาท = 1.40 นาที</p>
                    <p class="mb-0">50 บาท = 1.50 นาที</p>
                    <p class="mb-0">100 บาท = 2.00 นาที</p>
                  </div>

                  <div class="text-center">
                    <v-btn-toggle
                      v-model="totalPayment"
                      color="primary"
                      variant="outlined"
                      mandatory
                    >
                      <v-btn text="10 บาท" value="1:20" />
                      <v-btn text="20 บาท" value="1:30" />
                      <v-btn text="40 บาท" value="1:40" />
                      <v-btn text="50 บาท" value="1:50" />
                      <v-btn text="100 บาท" value="2:0" />
                    </v-btn-toggle>
                  </div>
                </v-col>
              </v-row>
            </v-container>
          </template>
          <template v-slot:actions>
            <v-btn
              class="ms-auto"
              text="ยกเลิก"
              color="secondary"
              @click="close()"
            />
            <v-btn
              text="ตกลง"
              color="primary"
              variant="elevated"
              :disabled="!totalPayment"
              @click="confirmPayment()"
            />
          </template>
        </v-card>
      </v-dialog>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios, { AxiosResponse } from "axios";

interface ApiResponse<T> {
  success: boolean;
  data: T;
}
interface MachineItems {
  _id: string;
  name: string;
  endTime: string | null;
  sendMessage: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

const apiUrl: string = import.meta.env.VITE_APP_API;
const wachingMachines = ref<MachineItems[]>([]);
const machineId = ref<string>("");
const active = ref<boolean>(false);
const totalPayment = ref<any>();

const getWatchingMachines = async (): Promise<void> => {
  try {
    const res: AxiosResponse<ApiResponse<any>> = await axios.get(
      `${apiUrl}/api/machines`
    );
    const { success, data } = res.data;
    if (!success) return;
    wachingMachines.value = data;
  } catch (error) {
    console.error("Error fetching watching machines", error);
  }
};
const timmer = (): void => {
  setInterval(watchMachinesTimes, 10000);
};
const watchMachinesTimes = (): void => {
  const current: any = new Date();
  const filterUnactive = wachingMachines.value.filter((i) => !i.active);
  filterUnactive.forEach((i) => {
    if (!i.active && i.endTime) {
      const end: any = new Date(i.endTime);
      const calTime: number = end - current;

      if (calTime <= 60000 && !i.sendMessage) {
        updateAndSendMessage(i._id, { sendMessage: 1 });
        lineMessages(`\nเครื่อง: ${i.name} \nเหลือเวลาอีก 1 นาที \nสถานะ: 🟠 กำลังใช้งาน`);
      }

      if (current >= end) {
        updateAndSendMessage(i._id, {
          endTime: null,
          sendMessage: 0,
          active: true,
        });
        lineMessages(`\nเครื่อง: ${i.name} \nหมดเวลา \nสถานะ: 🟢 พร้อมใช้งาน`);
      }
    }
  });
};

const payment = async (id: string): Promise<void> => {
  machineId.value = id;
  active.value = !active.value;
};
const generateTime = (minute: number, second: number): Date => {
  const today = new Date();
  return new Date(today.getTime() + (minute * 60 + second) * 1000);
};
const confirmPayment = async (): Promise<void> => {
  try {
    if (!totalPayment.value) return;

    const selectedTime = totalPayment.value.split(":");
    if (!selectedTime?.length) return;
    const endTime = generateTime(
      parseInt(selectedTime[0]),
      parseInt(selectedTime[1])
    );

    const res: AxiosResponse<ApiResponse<any>> = await axios.put(
      `${apiUrl}/api/machines/${machineId.value}`,
      {
        endTime,
        active: false,
      }
    );
    const { success } = res.data;
    if (!success) return;

    close();
    await getWatchingMachines();
  } catch (error) {
    console.error("Error confirm payment", error);
  }
};

const updateAndSendMessage = async (
  id: string,
  payload: object
): Promise<void> => {
  try {
    const res: AxiosResponse<ApiResponse<any>> = await axios.put(
      `${apiUrl}/api/machines/${id}`,
      { ...payload }
    );
    const { success } = res.data;
    if (!success) return;

    await getWatchingMachines();
  } catch (error) {
    console.log("Error update:", error);
  }
};
const lineMessages = async (message: string): Promise<void> => {
  try {
    const token: string = import.meta.env.VITE_APP_NOTIFY_TOKEN;
    const formData = new FormData();
    formData.append("message", message);

    const res: AxiosResponse<ApiResponse<any>> = await axios.post(
      `/LINE/api/notify`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const { success } = res.data;
    if (!success) return;
  } catch (error) {
    console.log("Cannot send message", error);
  }
};

const close = (): void => {
  active.value = false;
  totalPayment.value = null;
  return;
};

onMounted(async (): Promise<void> => {
  await Promise.all([getWatchingMachines(), timmer()]);
});
</script>

<style scoped></style>
