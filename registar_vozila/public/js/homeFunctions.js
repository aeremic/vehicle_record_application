const load = function(){
    login()
    getCars()
    getDrivers()
}

const login = function(){
    var xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            var res = this.responseText.split(' ')

            if(res[0] == 'succ'){
                document.getElementById('imeUlogovanog').innerHTML = res[1]
                var avatar = document.getElementById('avatar')
                if(avatar.style.display === 'none')
                    avatar.style.display = 'block'
            } else {
                alert('Neuspesno logovanje')
                window.location.href = '/'
            }
        }
    }

    xhttp.open('GET', 'login', true)
    xhttp.send()
}

const logout = function(){
    var xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            window.location.href = '/'
        }
    }

    xhttp.open('POST', 'logout', true)
    xhttp.send()
}

const getCars = function(){
    var xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            var rows = JSON.parse(this.responseText)
            
            var tableStr = "<thead class='thead-light'><tr><th>Marka</th><th>Model</th><th>Vlasnik</th><th>Broj registracije</th>"
            tableStr += "<th>Izmeni</th><th>Izbrisi</th></tr>"
            tableStr += "</thead>"
            for(i=0;i<rows.length;i++){
                tableStr += "<tbody>"
                tableStr += "<tr><td>" + rows[i].manufacturerName + "</td><td>" + rows[i].modelName + "</td><td>" + rows[i].firstName + " " + rows[i].lastName + "</td><td>" + rows[i].regNo + "</td>"
                tableStr += "<td><button type='button' class='btn btn-primary' onclick='editCar(" + rows[i].idCar + ")'>Izmeni</button></td>"
                tableStr += "<td><button type='button' class='btn btn-danger' onclick='deleteCar(" + rows[i].idCar + ")'>Obrisi</button></td>"
                tableStr += "</tr>"
            }

            tableStr += "</tbody>"
            document.getElementById('showTable').innerHTML = tableStr
        }
    }

    xhttp.open('GET', 'data_cars', true)
    xhttp.send()
}

const getDrivers = function(){
    var xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            var rows = JSON.parse(this.responseText)

            var selectStr = ""
            for(i=0;i<rows.length;i++){
                selectStr += "<option value='" + rows[i].idDriver + "'>" + rows[i].firstName  + " " + rows[i].lastNAme + "</option>"
            }

            document.getElementById('driversList').innerHTML = selectStr
        }
    }

    xhttp.open('GET', 'data_drivers', true)
    xhttp.send()
}

var enterCar = function(){
    if(markaNaziv.value != '' && modelNaziv.value != '' && registracija.value != ''){
        var xhttp = new XMLHttpRequest()
        xhttp.onreadystatechange = function(){
            if(this.readyState == 4 && this.status == 200){
                // alert("Car successfully added.")
                window.location.href = '/home.html'
            }
        }

        var selectedItem = document.getElementById('driversList');
        var driverId = selectedItem.value
        
        xhttp.open('POST', 'insert_car', true)
        xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
        xhttp.send('manufacturer_name=' + markaNaziv.value + '&model_name=' + modelNaziv.value + '&reg_no=' + registracija.value + '&driver_id=' + driverId)
    }
}

var editCar = function(carId){
    window.location.href = '/change_car.html?car_id=' + carId
}

var deleteCar = function(carId){
   var xhttp = new XMLHttpRequest()
   xhttp.onreadystatechange = function(){
       if(this.readyState == 4 && this.status == 200){
           // alert("Car successfully deleted.")
           window.location.href = '/home.html'
       }
   }

   xhttp.open('POST', 'delete_car', true)
   xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
   xhttp.send('car_id=' + carId)
}