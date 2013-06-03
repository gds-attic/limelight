class FcoController < ApplicationController

  def pay_legalisation_post
    @transaction_title = 'Pay to get documents legalised by post'
    render_index
  end
  
  def pay_legalisation_drop_off
    @transaction_title = 'Pay to legalise documents using the premium service'
    render_index
  end
  
  def pay_register_birth_abroad
    @transaction_title = 'Payment to register a birth abroad in the UK'
    render_index
  end
  
  def pay_register_death_abroad
    @transaction_title = 'Payment to register a death abroad'
    render_index
  end
  
  def pay_foreign_marriage_certificates
    @transaction_title = 'Payment for certificates to get married abroad'
    render_index
  end
  
  def deposit_foreign_marriage
    @transaction_title = 'Deposit foreign marriage or civil partnership certificates'
    render_index
  end

  private

  def render_index
    respond_to do |format|
        format.html { render :template => "fco/index" }
    end
  end

end
