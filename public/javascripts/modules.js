
function CountChecked(obj){
        var chkbox = document.getElementsByClassName("chk");
        var chkCnt = 0;
        for(var i=0;i<chkbox.length; i++){
            if(chkbox[i].checked){
                chkCnt++;
            }
        }
        if(chkCnt>3){
            alert("3개까지만 선택가능합니다.");
            obj.checked = false;
            return false;
        }
    }

