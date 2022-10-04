//레미콘사 견적내역
function remicon_getApi(id) {
  //Korean
  num_remicon_estimate++;
  var lang_kor = {
    decimal: "",
    emptyTable: "데이터가 없습니다.",
    info: "_START_ 부터- _END_ 까지 (총 _TOTAL_ 데이터)",
    infoEmpty: "0개",
    infoFiltered: "(전체 _MAX_명 중 검색결과)",
    infoPostFix: "",
    thousands: ",",
    lengthMenu: "_MENU_개씩 보기",
    loadingRecords: "로딩중...",
    processing: "처리중...",
    search: "검색 :",
    zeroRecords: "검색된 데이터가 없습니다.",
    paginate: {
      first: "첫 페이지",
      last: "마지막페이지",
      next: "다음",
      previous: "이전",
    },
    aria: { sortAscending: ":오름차순 정렬", sortDescending: ":내림차순 정렬" },
  };

  var editor; // use a global for the submit and return data rendering in the examples
  var targetDate;
  var targetDate2;

  $(document).ready(function () {
    //CRUD
    editor = new $.fn.dataTable.Editor({
      //`/api/remicon_esimate_management/${id}`,
      ajax: `/api/remicon_esimate_management/${id}`,
      table: "#remicon_esimate_table",
      fields: [
        {
          label: "건설사",
          name: "companies.name",
        },
        {
          label: "건설현장",
          name: "spaces.name",
        },
        {
          label: "건설사주소",
          name: "spaces.basic_address",
        },

        // {
        //   label: "견적률",
        //   name: "estimations.percent",
        // },
        // {
        //   label: "견적상태",
        //   name: "estimations.status",
        //   type: "select",
        //   options: [
        //     { label: "요청", value: "REQUESTED" },
        //     { label: "응답", value: "RESPONDED" },
        //     { label: "등록", value: "REGISTERED" },
        //     { label: "적용", value: "APPLIED" },
        //     { label: "완료", value: "FINISHED" },
        //   ],
        // },

        // {
        //   label: "일시",
        //   name: "estimations.created_at",
        //   type: "datetime",
        //   def: function () {
        //     return new Date();
        //   },
        //   format: "YYYY-MM-DD",
        // },
      ],
    });

    // 항목별 검색기능
    if (num_remicon_estimate == 1) {
      $("#remicon_esimate_table thead tr")
        .clone(true)
        .addClass("remicon_filters_estimate")
        .appendTo("#remicon_esimate_table thead");
    }

    // $('#min').datepicker({ onChangeMonthYear: function () { table.draw(); }, changeMonth: true, changeYear: true });
    // $('#max').datepicker({ onChangeMonthYear: function () { table.draw(); }, changeMonth: true, changeYear: true });
    $("#remicon_esimate_table").DataTable().destroy();
    var estimate_table = $("#remicon_esimate_table").DataTable({
      orderCellsTop: true,
      fixedHeader: true,
      initComplete: function () {
        var api = this.api();

        // For each column
        api
          .columns()
          .eq(0)
          .each(function (colIdx) {
            // Set the header cell to contain the input element
            var cell = $(".remicon_filters_estimate th").eq(
              $(api.column(colIdx).header()).index()
            );
            var title = $(cell).text();

            $(cell).html('<input type="text" placeholder="검색"/>');

            // On every keypress in this input
            $(
              "input",
              $(".remicon_filters_estimate th").eq(
                $(api.column(colIdx).header()).index()
              )
            )
              .off("keyup change")
              .on("change", function (e) {
                // Get the search value
                $(this).attr("title", $(this).val());
                var regexr = "({search})"; //$(this).parents('th').find('select').val();
                // Search the column for that value
                api
                  .column(colIdx)
                  .search(
                    this.value != "" ? this.value : "",
                    this.value != "",
                    this.value == ""
                  )
                  .draw();
              })
              .on("keyup", function (e) {
                e.stopPropagation();

                $(this).trigger("change");
              });
          });
      },
      // 항목별 검색기능 끝.
      //DATA 바인딩
      dom: "Bfrtip",
      ajax: {
        // url: `/api/remicon_esimate_management/${id}/${min}/${max}`,
        // url: `/api/remicon_esimate_management/${id}/${min}/${max}`,
        url: `/api/remicon_esimate_management/${id}`,
        type: "post",
        // data: "data",

        data: function (data, row) {
          // (data.columns[1].search.value = "2022-08-08") ||
          // (data.columns[1].search.value = "2022-08-09");

          // data.columns[1].search.value = "2022-08-08";

          // for (var i = 0; i < 2; i++) {
          //   data.columns[1].search.value = "2022-08-08";
          // }
          if (targetDate2 === undefined) {
            data.columns[1].search.value = "";
            console.log("if");
          } else if (targetDate2.length == 0) {
            data.columns[1].search.value = "9999-99-99";
          }
          for (key in targetDate2) {
            console.log("트루", targetDate2[key]);
            data.columns[1].search.value || targetDate2[key];
          }
        },
      },
      language: lang_kor,
      columns: [
        { data: "estimations.id" },
        { data: "estimations.created_at" },
        { data: "companies.id" },
        { data: "companies.name" },
        { data: "spaces.id" },
        { data: "spaces.name" },
        // { data: "spaces.basic_address" },
        { data: "users.name" },
        { data: "estimations.percent" },
        {
          data: "estimations.status",
          render: function (data, type, row) {
            switch (data) {
              case "REQUESTED":
                return "견적요청접수";
                break;
              case "RESPONDED":
                return "응답";
                break;
              case "REGISTERED":
                return "견적제출";
                break;
              case "APPLIED":
                return "적용";
                break;
              case "FINISHED":
                return "납품사등록완료";
                break;
              case null:
                return "";
                break;
            }
          },
        },
        { data: "users.name" },
      ],
      select: true,
      serverSide: true,
      searchable: true,
      search: {
        regex: true,
      },
      destroy: true,
      searching: true,
      buttons: [
        { extend: "create", editor: editor, text: "등록" },
        { extend: "edit", editor: editor, text: "상세보기 및 수정" },
        { extend: "remove", editor: editor, text: "삭제" },
        {
          extend: "collection",
          text: "내보내기",
          buttons: ["excel", "csv"],
        },
      ],
    });

    var current_year = new Date().getFullYear();

    $("#remicon_esimate_table_filter").prepend(
      '<input type="date" id="toDate" placeholder="yyyy-MM-dd" value=' +
        current_year +
        "-12-31>"
    );
    $("#remicon_esimate_table_filter").prepend(
      '<input type="date" id="fromDate" placeholder="yyyy-MM-dd" value=' +
        current_year +
        "-01-01>~"
    );

    $("#remicon_esimate_table_filter").prepend(
      '<button type="button" id="button_date" placeholder="yyyy-MM-dd">조회</button>'
    );

    $("#button_date").click(function () {
      console.log("버튼클릭");

      $.ajax({
        type: "POST",
        // url: `/api/remicon_esimate_management/${id}/${min}/${max}`,
        url: `/api/remicon_esimate_management/${id}`,
        // data: "json",
        // data: function (data, row) {
        //   console.log(data);
        // },
        success: function (data) {
          // console.log("data", data);
          // console.log("data", data.data[0]);
          // console.log("data2", data.data[0].estimations.created_at);
          // console.log("성공");
          targetDate = [];
          for (let key in data.data) {
            targetDate.push(data.data[key].estimations.created_at);
            // console.log("targetDate", targetDate);
          }
        },
      });
      targetDate2 = [];

      var min = $("#fromDate").val();
      var max = $("#toDate").val();
      console.log("max", max);
      console.log("min", min);

      for (let key in targetDate) {
        // console.log(key);
        if (targetDate[key] >= min && targetDate[key] <= max) {
          // estimate_table.column(1).search || targetDate[key].draw();
          // console.log("트루", targetDate[key]);
          targetDate2.push(targetDate[key]);
          console.log("트루1", targetDate2[key]);
        } else {
          console.log("펄스");
          // estimate_table.column(1).search(max).draw();
        }
      }

      estimate_table.ajax.reload();
    });

    // estimate_table.columns(1).every(function () {
    //   console.log("asdf");
    //   // estimate_table.column.draw();
    //   estimate_table.column(1).search("2022-08-08").draw();
    //   estimate_table.column(1).search("2022-08-09").draw();
    // });

    // estimate_table.on("draw.dt", () => {
    //   console.log("asdfsfsfs");

    $("#toDate, #fromDate").on("keyup", function () {
      // var min = $("#fromDate").val();
      // var max = $("#toDate").val();
      // console.log("max", max);
      // console.log("min", min);
      // estimate_table.column(1).search || ("2022-08-08", "2022-08-09").draw();
      // $.ajax({
      //   type: "POST",
      //   url: `/api/remicon_esimate_management/${id}`,
      //   data: "json",
      //   success: function (data) {
      //     // console.log("성공");
      //     targetDate = [];
      //     for (let key in data.data) {
      //       targetDate.push(data.data[key].estimations.created_at);
      //       console.log("targetDate", targetDate);
      //     }
      //     estimate_table.draw();
      //   },
      // });
      // for (let key in targetDate) {
      //   // console.log(key);
      //   if (targetDate[key] >= min && targetDate[key] <= max) {
      //     estimate_table.column(1).search || targetDate[key].draw();
      //     console.log("트루", targetDate[key]);
      //   } else {
      //     console.log("펄스");
      //     estimate_table.column(1).search(max).draw();
      //   }
      // }
    });

    //   $("#toDate, #fromDate").click(function () {
    //     console.log("확인");
    //     var fromDate = $("#fromDate").val();
    //     var toDate = $("#toDate").val();
    //     console.log(fromDate, toDate);

    //     // $("#bordTable").DataTable().ajax.reload(null, false);

    //     $.ajax({
    //       type: "POST",
    //       url: `/api/remicon_esimate_management/${fromDate}`,
    //     }).done(function (data) {
    //       console.log("화긴");
    //       // $("#remicon_esimate_table").DataTable().destroy();

    //       $("#remicon_esimate_table").DataTable().draw();
    //       // table.draw();
    //       // table.reload();
    //       // var refreshedDataFromTheServer = getDataFromServer();

    //       // var myTable = $("#remicon_esimate_table").DataTable();
    //       // myTable.clear().rows.add(refreshedDataFromTheServer).draw();
    //     });

    //     //
    //     // $("#toDate, #fromDate")
    //     //   .unbind()
    //     //   .bind("keyup", function () {
    //     //     table.draw();
    //     //   });
    //   });
    // });

    // var min = $("#fromDate").val();
    // var max = $("#toDate").val();
    // console.log("확인용", min, max);
  });
}
