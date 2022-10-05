// 건설사견적내역

function getApi(id) {
  num_con_estimate++;

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
    aria: {
      sortAscending: ":오름차순 정렬",
      sortDescending: ":내림차순 정렬",
    },
  };

  var editor; // use a global for the submit and return data rendering in the examples

  let min;
  let max;
  min = $("#con_esimate_fromDate").val();
  max = $("#con_esimate_toDate").val();
  console.log("min max", min, max);

  if (id === null) {
    retrun;
  }
  $(document).ready(function () {
    //CRUD

    editor = new $.fn.dataTable.Editor({
      ajax: `/api/construction_esimate_management/${id}/${min}/${max}`,
      table: "#construction_esimate_table",
      fields: [
        {
          label: "건설사 견적요청일",
          name: "estimations.created_at",
          type: "datetime",
        },
        {
          label: "건설현장코드",
          name: "b.id",
        },
        {
          label: "현장명",
          name: "b.name",
        },
        {
          label: "레미콘사 코드",
          name: "companies.id",
        },
        {
          label: "레미콘사 상호",
          name: "companies.name",
        },
        // {
        //   label: "레미콘 공장 주소",
        //   name: "spaces.basic_address",
        // },
        // {
        //   label: "영업사원",
        //   name: "users.name",
        // },
        {
          label: "견적단가율",
          name: "estimations.percent",
        },
        {
          label: "상태",
          name: "estimations.status",
          type: "select",
          options: [
            { label: "견적요청접수", value: "REQUESTED" },
            // { label: "응답", value: "RESPONDED" },
            { label: "견적제출", value: "REGISTERED" },
            // { label: "적용", value: "APPLIED" },
            { label: "납품사등록완료", value: "FINISHED" },
          ],
        },
        {
          label: "레미콘사담당자",
          name: "users.name",
        },
      ],
    });
    // 항목별 검색기능

    if (num_con_estimate == 1) {
      $("#construction_esimate_table thead tr")
        .clone(true)
        .addClass("con_filters_estimate")
        .appendTo("#construction_esimate_table thead");
    }
    // $("#construction_esimate_table thead *").remove();
    $("#construction_esimate_table").DataTable({
      orderCellsTop: true,
      fixedHeader: true,
      // destroy: true,
      // searching: true,
      initComplete: function () {
        var api = this.api();

        // For each column
        api
          .columns()
          .eq(0)
          .each(function (colIdx) {
            // Set the header cell to contain the input element
            var cell = $(".con_filters_estimate th").eq(
              $(api.column(colIdx).header()).index()
            );
            var title = $(cell).text();
            $(cell).html('<input type="text" placeholder="검색" />');

            // On every keypress in this input
            $(
              "input",
              $(".con_filters_estimate th").eq(
                $(api.column(colIdx).header()).index()
              )
            )
              .off("keyup change")
              .on("change", function (e) {
                // Get the search value
                $(this).attr("title", $(this).val());
                var regexr = "({search})"; //$(this).parents('th').find('select').val();

                // var cursorPosition = this.selectionStart;

                // Search the column for that value
                api
                  .column(colIdx)
                  .search(
                    this.value != ""
                      ? regexr.replace("{search}", "(((" + this.value + ")))")
                      : "",
                    this.value != "",
                    this.value == ""
                  )
                  .draw();
              })
              .on("keyup", function (e) {
                e.stopPropagation();

                $(this).trigger("change");
                $(this).focus()[0];
                // .setSelectionRange(cursorPosition, cursorPosition);
              });
          });
      },
      // 항목별 검색기능 끝.
      //DATA 바인딩
      dom: "Bfrtip",
      ajax: {
        url: `/api/construction_esimate_management/${id}/${min}/${max}`,
        // type: "get",
      },
      destroy: true,
      select: true,
      serverside: true,
      language: lang_kor,
      columns: [
        { data: "estimations.created_at" },
        // { data: "spaces.id" },
        // { data: "spaces.name" },
        { data: "b.id" },
        { data: "b.name" },
        { data: "companies.id" },
        { data: "companies.name" },
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

    $("#construction_esimate_table_filter").prepend(
      '<input type="date" id="con_esimate_toDate" placeholder="yyyy-MM-dd" value=' +
        current_year +
        "-12-31>"
    );
    $("#construction_esimate_table_filter").prepend(
      '<input type="date" id="con_esimate_fromDate" placeholder="yyyy-MM-dd" value=' +
        current_year +
        "-01-01>~"
    );

    $("#construction_esimate_table_filter").prepend(
      '<button type="button" id="con_esimate_button_date">조회</button>'
    );

    $("#con_esimate_button_date").click(function () {
      console.log("버튼클릭");

      min = $("#con_esimate_fromDate").val();
      max = $("#con_esimate_toDate").val();
      console.log("max", max);
      console.log("min", min);
      getApi(id);
      // $.ajax({
      //   type: "POST",
      //   url: `/api/remicon_esimate_management/${id}/${min}/${max}`,
      //   success: function (data) {
      //     remicon_getApi(id);
      //   },
      // });
    });
  });
}
