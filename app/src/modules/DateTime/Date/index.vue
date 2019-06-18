<template>
    <div class="date">
        <span><span class="day">{{ day }}</span>&nbsp;<span class="date">{{ date }}</span>&nbsp;<span class="month">{{ month }}</span></span>
    </div>
</template>

<script>
const getDate = () => new Date();

const getDateValue = () => getDate().getDate();

const getDay = () => {
    const days = ["Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag", "Söndag"];

    return days[getDate().getDay() - 1];
}

const getMonth = () => {
    const months = ["Januari", "Februari", "Mars", "April", "Maj", "Juni", "Juli", "Augusti", "September", "Oktober", "November", "December"];

    return months[getDate().getMonth()];
}

export default {
    name: "Date",
    data(){
        return {
            ticker: null,
            date: getDateValue(),
            day: getDay(),
            month: getMonth()
        }
    },
    created(){
        this.ticker = setInterval(() => {
            this.date = getDateValue();
            this.day = getDay();
            this.month = getMonth();
        }, 1000);
    },
    destroyed(){
        clearInterval(this.ticker);
    }
}
</script>

<style lang="scss" scoped>
    .date{
        padding-bottom: 5px;

        span{
            font-weight: 700;
            font-size: 1.1em;
        }
    }
</style>
