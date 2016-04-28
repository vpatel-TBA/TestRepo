F2_jsonpCallback_199({
    "scripts": [
		config.clientUrl + "/Products/VCM/199/appclass.js"
    ],
    "styles": [
		config.clientUrl + "/Products/VCM/199/app.css"
    ],
    "apps": [{
        "data": {},

        "html": ['  <div class="col-md-5">         <table class="tblClass hdrBorder table table-condensed" id="199">             <thead>             </thead>              <tbody>                 <tr>                     <td>                         <table class="bondYield_Manual2">                             <tr>                                 <td colspan="4">                                     <div class="productNameHdr pull-left">                                         <strong>Bond Yield Calculator (Manual)</strong>                                     </div>                                 </td>                             </tr>                             <tr>                                 <td colspan="4">                                     <div class="ServerName" style="text-align: left!important;"></div>                                 </td>                             </tr>                             <tr>                                 <td class="first">Currency</td>                                 <td>                                     <select id="199_1"></select>                                 </td>                                 <td class="first">BondType</td>                                 <td>                                     <select id="199_5"></select>                                 </td>                              </tr>                               <tr>                                 <td class="first">Coupon Freq</td>                                 <td>                                     <select id="199_500"></select>                                 </td>                                 <td class="first">Day Cnt Cnv</td>                                 <td>                                     <select id="199_501"></select>                                 </td>                             </tr>                               <tr>                                 <td class="first">Coupon</td>                                 <td>                                     <input id="199_250" type="text" />                                 </td>                                 <td class="first">Maturity</td>                                 <td>                                     <input id="199_300"                                            type="text" title="datepick" />                                 </td>                             </tr>                               <tr>                                 <td class="first">Issue date</td>                                 <td>                                     <input id="199_350" type="text" title="datepick" />                                 </td>                                 <td class="first">Settlement Dt</td>                                 <td>                                     <input id="199_400" type="text" title="datepick" />                                 </td>                             </tr>                               <tr>                                 <td class="first">First Cpn Dt</td>                                 <td>                                     <input id="199_450" type="text" title="datepick" />                                 </td>                                 <td class="first">Last Cpn Dt</td>                                 <td>                                     <input id="199_451" type="text" title="datepick" />                                 </td>                             </tr>                               <tr></tr>                             <tr>                                 <td class="first">Accr. Interest</td>                                 <td>                                     <input id="199_251" type="text" />                                 </td>                                 <td class="first">Key Rate Dur.</td>                                 <td>                                     <input id="199_420" type="text" />                                 </td>                              </tr>                              <tr>                                 <td class="first">Call Price</td>                                 <td> <input id="199_8" type="text" /> </td>                                 <td></td>                                 <td>                                     <input id="199_70" style="background-color: lightyellow; color: navy" type="button" onclick="ShowSearchList2();" value="Search Bond" />                                 </td>                             </tr>                               <tr>                                 <td></td>                                 <td class="first">Calc@Price</td>                                  <td class="first">1%-Yield</td>                                  <td class="first">1%+Yield</td>                              </tr>                               <tr>                                 <td class="first">Price</td>                                 <td>                                     <input id="199_1000" type="text" />                                 </td>                                 <td>                                     <input id="199_1001" type="text" />                                 </td>                                 <td>                                     <input id="199_1002" type="text" />                                 </td>                             </tr>                               <tr>                                 <td class="first">Current Yield</td>                                 <td>                                     <input id="199_1900" type="text" />                                 </td>                                 <td>                                     <input id="199_1901" type="text" />                                 </td>                                 <td>                                     <input id="199_1902" type="text" />                                 </td>                             </tr>                               <tr>                                 <td class="first">Yield To Mat.</td>                                 <td>                                     <input id="199_1100" type="text" />                                 </td>                                 <td>                                     <input id="199_1101" type="text" />                                 </td>                                 <td>                                     <input id="199_1102" type="text" />                                 </td>                              </tr>                              <tr></tr>                             <tr>                                 <td class="first">Macaulay Dur.</td>                                 <td>                                     <input id="199_1200" type="text" />                                 </td>                                 <td>                                     <input id="199_1201" type="text" />                                 </td>                                 <td>                                     <input id="199_1202" type="text" />                                 </td>                              </tr>                               <tr>                                 <td class="first">Modified Dur.</td>                                 <td>                                     <input id="199_1300" type="text" />                                 </td>                                 <td>                                     <input id="199_1301" type="text" />                                 </td>                                 <td>                                     <input id="199_1302" type="text" />                                 </td>                             </tr>                               <tr>                                 <td class="first">Effective Dur.</td>                                 <td>                                     <input id="199_1400" type="text" />                                 </td>                                 <td>                                     <input id="199_1401" type="text" />                                 </td>                                 <td>                                     <input id="199_1402" type="text" />                                 </td>                             </tr>                               <tr>                                 <td class="first">Convexity</td>                                 <td>                                     <input id="199_1500" type="text" />                                 </td>                                 <td>                                     <input id="199_1501" type="text" />                                 </td>                                 <td>                                     <input id="199_1502" type="text" />                                 </td>                             </tr>                               <tr>                                 <td class="first">$ Convexity</td>                                 <td>                                     <input id="199_1600" type="text" />                                 </td>                                 <td>                                     <input id="199_1601" type="text" />                                 </td>                                 <td>                                     <input id="199_1602" type="text" />                                 </td>                             </tr>                               <tr>                                 <td class="first">Price Val. BP</td>                                 <td>                                     <input id="199_1700" type="text" />                                 </td>                                 <td>                                     <input id="199_1701" type="text" />                                 </td>                                 <td>                                     <input id="199_1702" type="text" />                                 </td>                             </tr>                             <tr>                                 <td class="first">Yield Val. PP</td>                                 <td>                                     <input id="199_1800" type="text" />                                 </td>                                 <td>                                     <input id="199_1801" type="text" />                                 </td>                                 <td>                                     <input id="199_1802" type="text" />                                 </td>                             </tr>                         </table>                     </td>                     <td>                         <table id="searchlst2" style="display: none">                              <tr>                                 <td class="first1" colspan="10">                                     <table>                                         <tr>                                              <td class="first">Ticker</td>                                             <td>                                                 <input class="clsblur" id="199_3000" type="text" />                                             </td>                                             <td class="first">Coupon</td>                                             <td>                                                 <input class="clsblur" id="199_3001" type="text" />                                             </td>                                             <td class="first">Maturity</td>                                             <td>                                                 <input class="clsblur" id="199_3002"                                                        type="text" title="datepick" />                                             </td>                                             <td class="first">OR Cusip</td>                                             <td>                                                 <input class="clsblur" id="199_3003" type="text" />                                             </td>                                             <td>                                                 <input id="199_3004" type="button" value="Search" />                                             </td>                                             <td>                                                 <button id="btnsearchlst2" class="close" type="button" style="float: right;" onclick="CloseSearch(this)">&times;</button>                                             </td>                                          </tr>                                     </table>                                 </td>                             </tr>                             <tr>                                 <td></td>                                 <td></td>                                 <td></td>                                 <td></td>                                  <td>                                     <input id="199_3005" type="button" value="Prev" />                                 </td>                                 <td>                                     <input id="199_3006" type="button" value="Next" />                                 </td>                             </tr>                             <tr>                                 <td style="display: none"></td>                                 <td class="first" style="text-align: center">Ticker</td>                                 <td class="first" style="text-align: center">Name</td>                                 <td class="first" style="text-align: center">Coupon</td>                                 <td class="first" style="text-align: center">Maturity</td>                                  <td class="first" style="text-align: center">Cusip</td>                              </tr>                             <tr>                                 <td style="display: none">                                     <input id="199_3021" type="button" />                                 </td>                                 <td style="cursor: pointer">                                     <input id="199_5000" class="first" type="text" />                                 </td>                                 <td style="cursor: pointer">                                     <input id="199_6000" type="text" style="width: 200px" />                                 </td>                                 <td style="cursor: pointer">                                     <input id="199_7000" type="text" />                                 </td>                                 <td style="cursor: pointer">                                     <input id="199_8000" type="text" title="datepick" />                                 </td>                                 <td style="cursor: pointer">                                     <input id="199_9000" type="text" />                                 </td>                                 <td></td>                             </tr>                             <tr>                                 <td style="display: none">                                     <input id="199_3022" type="button" />                                 </td>                                 <td style="cursor: pointer">                                     <input id="199_5001" type="text" />                                 </td>                                 <td style="cursor: pointer">                                     <input id="199_6001" type="text" style="width: 200px" />                                 </td>                                 <td style="cursor: pointer">                                     <input id="199_7001" type="text" />                                 </td>                                 <td style="cursor: pointer">                                     <input id="199_8001" type="text" title="datepick" />                                 </td>                                 <td style="cursor: pointer">                                     <input id="199_9001" type="text" />                                 </td>                             </tr>                             <tr>                                 <td style="display: none">                                     <input id="199_3023" type="button" />                                 </td>                                 <td style="cursor: pointer">                                     <input id="199_5002" type="text" />                                 </td>                                 <td style="cursor: pointer">                                     <input id="199_6002" type="text" style="width: 200px" />                                 </td>                                 <td style="cursor: pointer">                                     <input id="199_7002" type="text" />                                 </td>                                 <td style="cursor: pointer">                                     <input id="199_8002" type="text" title="datepick" />                                 </td>                                 <td style="cursor: pointer">                                     <input id="199_9002" type="text" />                                 </td>                             </tr>                             <tr>                                 <td style="display: none">                                     <input id="199_3024" type="button" />                                 </td>                                 <td style="cursor: pointer">                                     <input id="199_5003" type="text" />                                 </td>                                 <td style="cursor: pointer">                                     <input id="199_6003" type="text" style="width: 200px" />                                 </td>                                 <td style="cursor: pointer">                                     <input id="199_7003" type="text" />                                 </td>                                 <td style="cursor: pointer">                                     <input id="199_8003" type="text" title="datepick" />                                 </td>                                 <td style="cursor: pointer">                                     <input id="199_9003" type="text" />                                 </td>                             </tr>                             <tr>                                 <td style="display: none">                                     <input id="199_3025" type="button" />                                 </td>                                  <td style="cursor: pointer">                                     <input id="199_5004" type="text" />                                 </td>                                 <td style="cursor: pointer">                                     <input id="199_6004" type="text" style="width: 200px" />                                 </td>                                 <td style="cursor: pointer">                                     <input id="199_7004" type="text" />                                 </td>                                 <td style="cursor: pointer">                                     <input id="199_8004" type="text" title="datepick" />                                 </td>                                 <td style="cursor: pointer">                                     <input id="199_9004" type="text" />                                 </td>                             </tr>                             <tr>                                 <td style="display: none">                                     <input id="199_3026" type="button" />                                 </td>                                 <td style="cursor: pointer">                                     <input id="199_5005" type="text" />                                 </td>                                 <td style="cursor: pointer">                                     <input id="199_6005" type="text" style="width: 200px" />                                 </td>                                 <td style="cursor: pointer">                                     <input id="199_7005" type="text" />                                 </td>                                 <td style="cursor: pointer">                                     <input id="199_8005" type="text" title="datepick" />                                 </td>                                 <td style="cursor: pointer">                                     <input id="199_9005" type="text" />                                 </td>                             </tr>                             <tr>                                 <td style="display: none">                                     <input id="199_3027" type="button" />                                 </td>                                 <td style="cursor: pointer">                                     <input id="199_5006" type="text" />                                 </td>                                 <td style="cursor: pointer">                                     <input id="199_6006" type="text" style="width: 200px" />                                 </td>                                 <td style="cursor: pointer">                                     <input id="199_7006" type="text" />                                 </td>                                 <td style="cursor: pointer">                                     <input id="199_8006" type="text" title="datepick" />                                 </td>                                 <td style="cursor: pointer">                                     <input id="199_9006" type="text" />                                 </td>                             </tr>                             <tr>                                 <td style="display: none">                                     <input id="199_3028" type="button" />                                 </td>                                 <td style="cursor: pointer">                                     <input id="199_5007" type="text" />                                 </td>                                 <td style="cursor: pointer">                                     <input id="199_6007" type="text" style="width: 200px" />                                 </td>                                 <td style="cursor: pointer">                                     <input id="199_7007" type="text" />                                 </td>                                 <td style="cursor: pointer">                                     <input id="199_8007" type="text" title="datepick" />                                 </td>                                 <td style="cursor: pointer">                                     <input id="199_9007" type="text" />                                 </td>                             </tr>                             <tr>                                 <td style="display: none">                                     <input id="199_3029" type="button" />                                 </td>                                 <td style="cursor: pointer">                                     <input id="199_5008" type="text" />                                 </td>                                 <td style="cursor: pointer">                                     <input id="199_6008" type="text" style="width: 200px" />                                 </td>                                 <td style="cursor: pointer">                                     <input id="199_7008" type="text" />                                 </td>                                 <td style="cursor: pointer">                                     <input id="199_8008" type="text" title="datepick" />                                 </td>                                 <td style="cursor: pointer">                                     <input id="199_9008" type="text" />                                 </td>                             </tr>                             <tr>                                 <td style="display: none">                                     <input id="199_3030" type="button" />                                 </td>                                 <td style="cursor: pointer">                                     <input id="199_5009" type="text" />                                 </td>                                 <td style="cursor: pointer">                                     <input id="199_6009" type="text" style="width: 200px" />                                 </td>                                 <td style="cursor: pointer">                                     <input id="199_7009" type="text" />                                 </td>                                 <td style="cursor: pointer">                                     <input id="199_8009" type="text" title="datepick" />                                 </td>                                 <td style="cursor: pointer">                                     <input id="199_9009" type="text" />                                 </td>                             </tr>                               <tr>                                 <td style="display: none">                                     <input id="199_3031" type="button" />                                 </td>                                 <td style="cursor: pointer">                                     <input id="199_5010" type="text" />                                 </td>                                 <td style="cursor: pointer">                                     <input id="199_6010" type="text" style="width: 200px" />                                 </td>                                 <td style="cursor: pointer">                                     <input id="199_7010" type="text" />                                 </td>                                 <td style="cursor: pointer">                                     <input id="199_8010" type="text" title="datepick" />                                 </td>                                 <td style="cursor: pointer">                                     <input id="199_9010" type="text" />                                 </td>                             </tr>                             <tr>                                 <td style="display: none">                                     <input id="199_3032" type="button" />                                 </td>                                 <td style="cursor: pointer">                                     <input id="199_5011" type="text" />                                 </td>                                 <td style="cursor: pointer">                                     <input id="199_6011" type="text" style="width: 200px" />                                 </td>                                 <td style="cursor: pointer">                                     <input id="199_7011" type="text" />                                 </td>                                 <td style="cursor: pointer">                                     <input id="199_8011" type="text" title="datepick" />                                 </td>                                 <td style="cursor: pointer">                                     <input id="199_9011" type="text" />                                 </td>                             </tr>                             <tr>                                 <td style="display: none">                                     <input id="199_3033" type="button" />                                 </td>                                 <td style="cursor: pointer">                                     <input id="199_5012" type="text" />                                 </td>                                 <td style="cursor: pointer">                                     <input id="199_6012" type="text" style="width: 200px" />                                 </td>                                 <td style="cursor: pointer">                                     <input id="199_7012" type="text" />                                 </td>                                 <td style="cursor: pointer">                                     <input id="199_8012" type="text" title="datepick" />                                 </td>                                 <td style="cursor: pointer">                                     <input id="199_9012" type="text" />                                 </td>                             </tr>                             <tr>                                 <td style="display: none">                                     <input id="199_3034" type="button" />                                 </td>                                 <td style="cursor: pointer">                                     <input id="199_5013" type="text" />                                 </td>                                 <td style="cursor: pointer">                                     <input id="199_6013" type="text" style="width: 200px" />                                 </td>                                 <td style="cursor: pointer">                                     <input id="199_7013" type="text" />                                 </td>                                 <td style="cursor: pointer">                                     <input id="199_8013" type="text" title="datepick" />                                 </td>                                 <td style="cursor: pointer">                                     <input id="199_9013" type="text" />                                 </td>                             </tr>                             <tr>                                 <td style="display: none">                                     <input id="199_3035" type="button" />                                 </td>                                 <td style="cursor: pointer">                                     <input id="199_5014" type="text" />                                 </td>                                 <td style="cursor: pointer">                                     <input id="199_6014" type="text" style="width: 200px" />                                 </td>                                 <td style="cursor: pointer">                                     <input id="199_7014" type="text" />                                 </td>                                 <td style="cursor: pointer">                                     <input id="199_8014" type="text" title="datepick" />                                 </td>                                 <td style="cursor: pointer">                                     <input id="199_9014" type="text" />                                 </td>                             </tr>                             <tr>                                 <td style="display: none">                                     <input id="199_3036" type="button" />                                 </td>                                 <td style="cursor: pointer">                                     <input id="199_5015" type="text" />                                 </td>                                 <td style="cursor: pointer">                                     <input id="199_6015" type="text" style="width: 200px" />                                 </td>                                 <td style="cursor: pointer">                                     <input id="199_7015" type="text" />                                 </td>                                 <td style="cursor: pointer">                                     <input id="199_8015" type="text" title="datepick" />                                 </td>                                 <td style="cursor: pointer">                                     <input id="199_9015" type="text" />                                 </td>                                 <td></td>                             </tr>                         </table>                     </td>                 </tr>             </tbody>         </table>     </div>'].join("")

    }]
})