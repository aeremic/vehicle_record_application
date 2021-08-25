const load = function(){
    getDriver()
}

const getDriver = function(){
    const param = new URLSearchParams(window.location.search)
    const car_id = param.get('car_id')

    var xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            var row = JSON.parse(this.responseText)

            document.getElementById('driver').innerHTML = row.firstName + ' ' + row.lastNAme
        }
    }

    xhttp.open('POST', 'data_driver', true)
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    xhttp.send('car_id=' + car_id)
}

var changeCar = function(){
    const param = new URLSearchParams(window.location.search)
    const car_id = param.get('car_id')

    var xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            window.location.href = '/home.html'
        }
    }

    xhttp.open('POST', 'change_car', true)
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    xhttp.send('car_id=' + car_id + '&manufacturer_name=' + inputMarka.value + '&model_name=' + inputModel.value + '&reg_no=' + inputRegistracija.value)
}
